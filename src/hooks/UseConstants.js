export function useConstants() {
    const host = `${process.env.REACT_APP_LOCAL_HOST}`;
    const language = localStorage.getItem('language') || 'ar';

    return {
        host, language
    };
}