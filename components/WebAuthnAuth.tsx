import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, Fingerprint, KeyRound, ShieldAlert, X } from 'lucide-react';
import { addAuditLog } from '../utils/auditLogger';
import { getActiveProfile } from '../utils/profileHelper';

interface WebAuthnAuthProps {
  onSuccess: () => void;
  onCancel?: () => void;
  actionType?: 'register' | 'authenticate';
}

interface SavedCredential {
  id: string;
  rawId: string;
  createdAt: string;
  label: string;
}

const CREDENTIAL_KEY = 'vaultspace_webauthn_credentials';

function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(length));
  crypto.getRandomValues(bytes);
  return bytes;
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function loadCredentials(): SavedCredential[] {
  const stored = localStorage.getItem(CREDENTIAL_KEY);
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedCredential => {
      if (!item || typeof item !== 'object') return false;
      const candidate = item as Partial<SavedCredential>;
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.rawId === 'string' &&
        typeof candidate.createdAt === 'string' &&
        typeof candidate.label === 'string'
      );
    });
  } catch {
    return [];
  }
}

const WebAuthnAuth: React.FC<WebAuthnAuthProps> = ({
  onSuccess,
  onCancel,
  actionType = 'authenticate',
}) => {
  const [mode, setMode] = useState<'register' | 'authenticate'>(actionType);
  const [credentials, setCredentials] = useState<SavedCredential[]>(loadCredentials);
  const [status, setStatus] = useState<'idle' | 'working' | 'responded' | 'error'>('idle');
  const [message, setMessage] = useState('No device prompt has run.');
  const profile = useMemo(getActiveProfile, []);
  const supported = typeof window !== 'undefined' && window.isSecureContext && 'PublicKeyCredential' in window;

  useEffect(() => {
    setMode(actionType);
  }, [actionType]);

  const persistCredentials = (next: SavedCredential[]) => {
    setCredentials(next);
    localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(next));
  };

  const registerCredential = async () => {
    if (!supported) {
      setStatus('error');
      setMessage('WebAuthn requires a supported browser and a secure HTTPS context.');
      return;
    }

    setStatus('working');
    setMessage('Waiting for the browser or operating-system device prompt…');
    try {
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: randomBytes(32),
        rp: { name: 'VaultSpace Browser Demo', id: window.location.hostname },
        user: {
          id: randomBytes(16),
          name: `${profile.alias}@vaultspace.demo`,
          displayName: profile.name,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        timeout: 60_000,
        attestation: 'none',
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
      };

      const result = await navigator.credentials.create({ publicKey });
      if (!(result instanceof PublicKeyCredential)) throw new Error('No credential was returned.');

      const saved: SavedCredential = {
        id: result.id,
        rawId: toBase64Url(result.rawId),
        createdAt: new Date().toISOString(),
        label: `${profile.name} device credential`,
      };
      persistCredentials([saved, ...credentials.filter((item) => item.id !== saved.id)]);
      setStatus('responded');
      setMessage('The device created a WebAuthn credential ID. This demo stores only that public identifier locally; no server account was created.');
      addAuditLog('Device prompt completed', 'A WebAuthn credential ID was created for this browser demo. No server verified or stored it.', 'info');
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'The device prompt did not complete.';
      setStatus('error');
      setMessage(reason);
      addAuditLog('Device prompt did not complete', reason, 'warning');
    }
  };

  const requestAssertion = async () => {
    if (!supported) {
      setStatus('error');
      setMessage('WebAuthn requires a supported browser and a secure HTTPS context.');
      return;
    }
    if (credentials.length === 0) {
      setStatus('error');
      setMessage('No local credential ID is available. Register one first or continue directly into the demo.');
      return;
    }

    setStatus('working');
    setMessage('Waiting for the browser or operating-system device prompt…');
    try {
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: randomBytes(32),
        rpId: window.location.hostname,
        allowCredentials: credentials.map((credential) => ({
          id: fromBase64Url(credential.rawId),
          type: 'public-key',
        })),
        timeout: 60_000,
        userVerification: 'preferred',
      };
      const result = await navigator.credentials.get({ publicKey });
      if (!(result instanceof PublicKeyCredential)) throw new Error('No assertion was returned.');

      setStatus('responded');
      setMessage('The device returned a WebAuthn assertion. A production service must verify that assertion on its server; this static demo cannot authenticate you.');
      addAuditLog('Device assertion returned', 'Browser received a WebAuthn assertion. It was not server-verified and is not treated as authentication.', 'warning');
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'The device prompt did not complete.';
      setStatus('error');
      setMessage(reason);
      addAuditLog('Device assertion unavailable', reason, 'warning');
    }
  };

  const handlePrimaryAction = () => {
    if (mode === 'register') void registerCredential();
    else void requestAssertion();
  };

  const clearCredentials = () => {
    if (!window.confirm('Remove the locally saved WebAuthn credential IDs from this browser?')) return;
    localStorage.removeItem(CREDENTIAL_KEY);
    setCredentials([]);
    setStatus('idle');
    setMessage('Local credential IDs removed. This does not remove passkeys from your device settings.');
    addAuditLog('Local credential IDs cleared', 'VaultSpace removed its browser-local WebAuthn identifiers.', 'warning');
  };

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-[#0D0D0D] px-6 py-8 text-white">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-6">
        <div className="flex items-start justify-between border-b border-[#2A2A2A] pb-5">
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-primary">Device prompt demo</p>
            <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">WebAuthn Lab</h1>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="grid size-10 place-items-center border border-[#2A2A2A] bg-[#141414]" aria-label="Close device prompt demo">
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 border border-[#2A2A2A] bg-[#141414] p-2">
          {(['authenticate', 'register'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => { setMode(item); setStatus('idle'); setMessage('No device prompt has run.'); }}
              className={`h-10 flex-1 px-3 font-mono text-[9px] font-semibold uppercase tracking-widest ${mode === item ? 'bg-primary text-black' : 'text-slate-400 hover:bg-[#1E1E1E]'}`}
            >
              {item === 'authenticate' ? 'Try assertion' : 'Register ID'}
            </button>
          ))}
        </div>

        <div className="border border-primary/30 bg-primary/5 p-4 text-left">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-bold text-primary">This is not account authentication.</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">VaultSpace is static. It can ask your browser for a WebAuthn response, but it has no trusted server to verify that response.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={status === 'working'}
          className="group flex min-h-24 items-center gap-4 border border-[#2A2A2A] bg-[#141414] p-5 text-left transition hover:border-primary disabled:opacity-60"
        >
          <span className="grid size-12 shrink-0 place-items-center border border-primary/40 bg-primary/10 text-primary">
            {mode === 'register' ? <KeyRound className="size-6" /> : <Fingerprint className="size-6" />}
          </span>
          <span>
            <span className="block text-sm font-bold">{status === 'working' ? 'Waiting for device…' : mode === 'register' ? 'Create a demo credential ID' : 'Request a device assertion'}</span>
            <span className="mt-1 block text-[10px] leading-relaxed text-slate-500">Uses the browser Web Authentication API when supported.</span>
          </span>
        </button>

        <div className={`border p-4 ${status === 'responded' ? 'border-primary/30 bg-primary/5' : status === 'error' ? 'border-red-500/30 bg-red-500/5' : 'border-[#2A2A2A] bg-[#141414]'}`} role="status" aria-live="polite">
          <div className="flex gap-3">
            {status === 'responded' ? <Check className="size-4 shrink-0 text-primary" /> : <AlertTriangle className="size-4 shrink-0 text-slate-500" />}
            <p className="text-[11px] leading-relaxed text-slate-300">{message}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onSuccess} className="h-12 bg-primary px-4 text-[10px] font-black uppercase tracking-[0.16em] text-black hover:bg-orange-500">
            Continue to demo
          </button>
          <button type="button" onClick={clearCredentials} disabled={credentials.length === 0} className="h-12 border border-[#2A2A2A] bg-[#141414] px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 disabled:opacity-40">
            Clear local IDs ({credentials.length})
          </button>
        </div>

        <p className="text-center font-mono text-[8px] uppercase tracking-[0.16em] text-slate-600">
          {supported ? 'WebAuthn available in this browser context' : 'WebAuthn unavailable in this browser context'}
        </p>
      </div>
    </div>
  );
};

export default WebAuthnAuth;
