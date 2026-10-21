/** Keep null until the recipient, secure service and privacy review are confirmed.
 * Public endpoints are not credentials. Never put SMTP/API secrets in client code.
 */
export type FormKind = 'contact' | 'careers' | 'partnerships';
export const formEndpoints: Record<FormKind, string | null> = {
  contact: null,
  careers: null,
  partnerships: null,
};
