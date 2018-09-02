import frameguard from "frameguard";
import * as hpp from "hpp";
import * as lusca from "lusca";

export default function(cthulhu) {
  /**
   * Reference: https://github.com/analog-nico/hpp
   * @description Express middleware to protect against HTTP Parameter Pollution attacks
   */
  cthulhu.use(hpp());

  // Reference: https://github.com/helmetjs/frameguard
  // Don't allow me to be in ANY frames:
  cthulhu.use(frameguard({ action: "deny" }));

  /**
   * Enables Cross Site Request Forgery (CSRF) headers.
   *
   * If enabled, the CSRF token must be in the payload when modifying data or
   * you will receive a 403 Forbidden. To send the token you'll need to echo
   * back the _csrf value you received from the previous request.
   *
   * Furthermore, parsers must be registered before lusca.
   */
  cthulhu.use(lusca.csrf());

  /**
   * @description Enables Content Security Policy (CSP) headers
   */
  cthulhu.use(lusca.csp({
    policy: {
      "default-src": "'self'",
      "img-src": "*",
    },
  }));

  /**
   * @description Enables X-FRAME-OPTIONS headers to help prevent Clickjacking.
   */
  cthulhu.use(lusca.xframe("SAMEORIGIN"));

  /**
   * @description Enables Platform for Privacy Preferences Project (P3P) headers.
   */
  cthulhu.use(lusca.p3p("ABCDEF"));

  /**
   * @description Enables HTTP Strict Transport Security for the host domain.
   * The preload flag is required for HSTS domain submissions to Chrome's HSTS
   * preload list.
   */
  cthulhu.use(lusca.hsts({
    includeSubDomains: true, // Must be enabled to be approved by Google
    maxAge: 10886400, // Must be at least 18 weeks to be approved by Google
    /**
     * Chrome lets you submit your site for baked-into-Chrome HSTS by adding preload to the
     * header. You can add that with the following code, and then submit your site to the
     * Chrome team at https://hstspreload.org/.
     */
    preload: true,
  }));

  /**
   * @description Middleware to set the X-XSS-Protection header
   * Enables X-XSS-Protection headers to help prevent cross site scripting (XSS)
   * attacks in older IE browsers (IE8)
   */
  cthulhu.use(lusca.xssProtection(true));

  /**
   * @description Enables X-Content-Type-Options header to prevent MIME-sniffing
   * a response away from the declared content-type.
   */
  cthulhu.use(lusca.nosniff());

  /**
   * @description Enables Referrer-Policy header to control the Referer header.
   */
  cthulhu.use(lusca.referrerPolicy("same-origin"));
}
