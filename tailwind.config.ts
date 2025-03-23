import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            colors: {
                white: '#FFFFFF',
                primary: '#0F62FE',
                'primary-dark': '#0043CE',
                'primary-light': '#D0E2FF',

                dark: '#1E293B',
                light: '#F8FAFC',

                // Neutral griler
                neutral: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },

                success: '#10B981',
                error: '#EF4444',
                warning: '#F59E0B',
            },
        },
    },
    plugins: [],
}

export default config