/**
 * ARCHON WEBAUTHN / BIOMETRIC PASSKEY MODULE
 *
 * Hardware-backed biometric authentication (FIDO2 / WebAuthn)
 * Supports Windows Hello, Touch ID, Face ID, and YubiKeys.
 * Utilizes standard Web Cryptography & Public-Key Credentials API.
 */

const CREDENTIAL_STORAGE_KEY = "__archon_webauthn_cred_id";

export interface WebAuthnStatus {
  isSupported: boolean;
  hasRegisteredPasskey: boolean;
}

export function checkWebAuthnSupport(): WebAuthnStatus {
  if (typeof window === "undefined") {
    return { isSupported: false, hasRegisteredPasskey: false };
  }

  const isSupported =
    typeof window.PublicKeyCredential !== "undefined" &&
    typeof navigator.credentials !== "undefined";

  const hasRegisteredPasskey = !!localStorage.getItem(CREDENTIAL_STORAGE_KEY);

  return { isSupported, hasRegisteredPasskey };
}

/**
 * Register hardware biometric passkey on this device
 */
export async function registerBiometricPasskey(): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return { success: false, message: "WebAuthn not supported by this browser." };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const creationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Darshan R — Archon Command Center",
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: "darshan.admin@archon.local",
        displayName: "Darshan R (Archon Owner)",
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // TouchID / Windows Hello
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    };

    const credential = (await navigator.credentials.create({
      publicKey: creationOptions,
    })) as PublicKeyCredential | null;

    if (!credential) {
      return { success: false, message: "Biometric registration was aborted." };
    }

    // Persist registered credential ID locally
    const rawId = Array.from(new Uint8Array(credential.rawId))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem(CREDENTIAL_STORAGE_KEY, rawId);

    return { success: true, message: "Hardware biometric passkey registered successfully!" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Hardware registration failed.";
    return { success: false, message: msg };
  }
}

/**
 * Verify hardware biometric passkey (Touch ID / Windows Hello)
 */
export async function verifyBiometricPasskey(): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return { success: false, message: "WebAuthn not supported." };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const requestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId: window.location.hostname,
      userVerification: "required",
      timeout: 60000,
    };

    // If we have a stored credential ID, specify it in allowCredentials
    const storedIdHex = localStorage.getItem(CREDENTIAL_STORAGE_KEY);
    if (storedIdHex) {
      const match = storedIdHex.match(/.{1,2}/g);
      if (match) {
        const rawId = new Uint8Array(match.map((byte) => parseInt(byte, 16)));
        requestOptions.allowCredentials = [
          {
            type: "public-key",
            id: rawId,
          },
        ];
      }
    }

    const assertion = await navigator.credentials.get({
      publicKey: requestOptions,
    });

    if (!assertion) {
      return { success: false, message: "Biometric challenge failed or cancelled." };
    }

    return { success: true, message: "Biometric clearance verified." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Biometric authentication failed.";
    return { success: false, message: msg };
  }
}
