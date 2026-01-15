import MercadoPagoConfig, { PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export const preapproval = new PreApproval(client);

export default client;
