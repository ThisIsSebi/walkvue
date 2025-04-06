import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';

export const vuetify = createVuetify({
    theme: {
        themes: {
            light: {
                colors: {
                    primary: '#ff9900',
                    secondary: '#64b5f6'
                }
            }
        }
    }
});