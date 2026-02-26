import localforage from 'localforage';

/**
 * useDoaStorage - menyediakan fungsi baca/tulis data Doa secara lokal (localforage).
 *
 * @param {object|null} user - User dari useUser()
 * @returns {object} - { loadDoaData, saveBookmarks, saveCustomDoas, saveSettings }
 */
const useDoaStorage = (user) => {
  const loadDoaData = async () => {
    try {
      const userKey = user?.personal_code || 'local';

      const bookmarks =
        (await localforage.getItem(`doa_bookmarks_${userKey}`)) || [];
      const customDoas =
        (await localforage.getItem(`doa_custom_${userKey}`)) || [];
      const settings =
        (await localforage.getItem(`doa_settings_${userKey}`)) || null;

      return { bookmarks, customDoas, settings };
    } catch (error) {
      console.error('Error loading doa data:', error);
      return { bookmarks: [], customDoas: [], settings: null };
    }
  };

  const saveBookmarks = async (newBookmarks) => {
    try {
      const userKey = user?.personal_code || 'local';
      await localforage.setItem(`doa_bookmarks_${userKey}`, newBookmarks);

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent('doa_bookmarks_updated', { detail: newBookmarks }),
        );
      }
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const saveCustomDoas = async (newCustomDoas) => {
    try {
      const userKey = user?.personal_code || 'local';
      await localforage.setItem(`doa_custom_${userKey}`, newCustomDoas);

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent('doa_custom_updated', { detail: newCustomDoas }),
        );
      }
    } catch (error) {
      console.error('Error saving custom doas:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const userKey = user?.personal_code || 'local';
      await localforage.setItem(`doa_settings_${userKey}`, newSettings);

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent('doa_settings_updated', { detail: newSettings }),
        );
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return { loadDoaData, saveBookmarks, saveCustomDoas, saveSettings };
};

export default useDoaStorage;
