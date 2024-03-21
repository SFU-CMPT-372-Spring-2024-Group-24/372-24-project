export const useBackendAPI = () => {
    const backendAPI = async (url: string, options: any = null) => {
        const response = await fetch(
            `${import.meta.env.VITE_APP_BACKEND_URL}${url}`,
            { ...options, credentials: 'omit' }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    };
  
    return backendAPI;
};