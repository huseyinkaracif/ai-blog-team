import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // API Settings
      apiKey: "",
      isApiKeyValid: false,
      isValidating: false,

      // UI Settings
      theme: "dark",
      language: "tr",

      // Actions
      setApiKey: (key) => set({ apiKey: key, isApiKeyValid: false }),

      validateApiKey: async (key) => {
        if (!key || key.trim().length < 10) {
          set({ isApiKeyValid: false });
          return false;
        }

        set({ isValidating: true });

        try {
          const res = await fetch("/api/settings/validate-key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: key }),
          });

          const data = await res.json();
          const isValid = data.valid === true;

          set({
            apiKey: key,
            isApiKeyValid: isValid,
            isValidating: false,
          });

          return isValid;
        } catch (err) {
          console.error("API key validation failed:", err);
          // Allow usage even if validation endpoint fails
          set({
            apiKey: key,
            isApiKeyValid: key.length >= 20,
            isValidating: false,
          });
          return key.length >= 20;
        }
      },

      clearApiKey: () => set({ apiKey: "", isApiKeyValid: false }),

      hasValidApiKey: () => {
        const { apiKey, isApiKeyValid } = get();
        return apiKey && apiKey.length >= 20 && isApiKeyValid;
      },

      // Check if API key exists (for initial check)
      hasApiKey: () => {
        const { apiKey } = get();
        return apiKey && apiKey.length >= 20;
      },
    }),
    {
      name: "ai-crew-settings",
      partialize: (state) => ({
        apiKey: state.apiKey,
        isApiKeyValid: state.isApiKeyValid,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
