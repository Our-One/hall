/**
 * Shared email template aligned with Our One brand.
 *
 * - Warm background (#FDFBF7)
 * - Bitter/Georgia serif for body
 * - IBM Plex Sans for UI elements
 * - Black button, no blue
 * - Horizontal logo inline SVG
 */

const LOGO_SVG = `<svg viewBox="0 0 746 121" fill="#0A0A0A" width="100" aria-label="Our One" style="display:block;">
  <path d="M60.201,0 C93.449,0 120.401,26.953 120.401,60.201 C120.401,93.449 93.449,120.402 60.201,120.402 C26.953,120.402 0,93.449 0,60.201 C0,26.953 26.953,0 60.201,0 z M60.201,22.997 C39.654,22.997 22.997,39.654 22.997,60.201 C22.997,80.748 39.654,97.405 60.201,97.405 C80.748,97.405 97.405,80.748 97.405,60.201 C97.405,39.654 80.748,22.997 60.201,22.997 z"/>
  <path d="M427.592,0 C460.84,0 487.792,26.953 487.792,60.201 C487.792,93.449 460.84,120.402 427.592,120.402 C394.344,120.402 367.391,93.449 367.391,60.201 C367.391,26.953 394.344,0 427.592,0 z M427.592,22.997 C407.044,22.997 390.388,39.654 390.388,60.201 C390.388,80.748 407.044,97.405 427.592,97.405 C448.139,97.405 464.796,80.748 464.796,60.201 C464.796,39.654 448.139,22.997 427.592,22.997 z"/>
  <path d="M127.104,11.498 C127.104,5.148 132.252,0 138.602,0 C144.953,0 150.101,5.148 150.101,11.498 L150.101,60.201 L150.1,60.201 C150.577,81.39 166.479,96.396 187.304,97.405 C208.231,97.131 223.984,80.937 224.509,60.201 L224.509,11.498 C224.509,5.148 229.657,0 236.007,0 C242.357,0 247.505,5.148 247.505,11.498 L247.505,60.201 C247.505,93.449 220.553,120.402 187.305,120.402 C154.057,120.402 127.104,93.449 127.104,60.201 L127.104,11.498 z"/>
  <path d="M494.495,108.903 C494.495,115.254 499.643,120.402 505.993,120.402 C512.343,120.402 517.491,115.254 517.491,108.903 L517.491,60.201 L517.491,60.201 C517.968,39.012 533.87,24.005 554.695,22.997 C575.622,23.27 591.375,39.464 591.899,60.201 L591.899,108.903 C591.899,115.254 597.047,120.402 603.398,120.402 C609.748,120.402 614.896,115.254 614.896,108.903 L614.896,60.201 C614.896,26.953 587.943,0 554.695,0 C521.448,0 494.495,26.953 494.495,60.201 L494.495,108.903 z"/>
  <path d="M314.408,0 L317.382,0.073 C332.426,1.017 346.205,7.151 356.965,17.645 L356.964,17.65 C359.326,19.784 360.267,22.811 360.424,25.914 C360.424,32.297 355.249,37.472 348.865,37.472 C345.586,37.416 342.962,36.236 340.657,33.932 L340.657,33.949 C333.727,26.907 324.093,23.673 314.408,22.997 C293.482,23.27 277.729,39.464 277.204,60.201 L277.204,109.687 L277.165,109.687 C276.802,115.983 271.756,120.096 265.706,120.402 C259.803,120.295 254.552,115.728 254.247,109.687 L254.208,109.687 L254.208,60.201 C254.338,26.752 281.172,0.42 314.408,0 z"/>
  <path d="M621.599,60.201 C621.596,44.518 627.686,30.325 638.181,18.845 L638.113,18.781 C646.156,10.437 656.483,4.243 667.857,1.756 C668.862,1.492 668.094,1.688 670.18,1.248 C671.861,0.88 671.113,0.996 672.412,0.841 C675.509,0.271 678.657,0.078 681.799,0 L681.799,0 L684.773,0.073 C688.035,0.28 691.289,0.707 694.466,1.481 C694.535,1.493 694.489,1.484 694.603,1.515 C698.893,2.56 697.203,2.027 699.74,2.892 C700.395,3.067 699.992,2.947 700.934,3.299 C704.083,4.372 702.772,3.835 704.915,4.787 C706.174,5.257 705.379,4.939 707.263,5.83 C708.815,6.519 708.206,6.199 709.129,6.713 C710.547,7.354 711.879,8.166 713.203,8.979 C713.511,9.151 713.363,9.059 713.648,9.252 C717.1,11.307 720.242,13.829 723.219,16.514 L723.219,16.514 L724.334,17.624 L724.355,17.645 L724.355,17.646 L724.497,17.786 C724.802,18.081 724.695,17.96 724.839,18.127 L725.327,18.614 C735.454,29.412 741.032,43.355 741.928,58.05 C742.019,58.497 741.94,58.091 742,59.288 C742,65.638 736.852,70.786 730.502,70.786 L646.31,70.786 C651.18,86.994 665.136,96.789 681.799,97.405 C691.484,96.729 701.118,93.495 708.048,86.453 L708.048,86.47 C710.353,84.165 712.977,82.986 716.256,82.93 C722.64,82.93 727.815,88.105 727.815,94.488 C727.658,97.59 726.717,100.618 724.354,102.752 L724.355,102.757 C713.596,113.25 699.817,119.385 684.773,120.328 L681.799,120.402 L681.799,120.402 C648.563,119.982 621.729,93.65 621.599,60.201 L621.599,60.201 z M682.532,23.06 L679.124,23.165 L678.961,23.18 L676.355,23.512 L674.985,23.743 L673.919,23.984 C671.572,24.434 669.349,25.298 667.145,26.191 L666.263,26.576 L664.627,27.381 L662.84,28.372 L661.984,28.874 C658.161,31.492 660.008,30.096 656.444,33.061 C651.953,37.029 648.807,42.149 646.886,47.789 L716.608,47.789 C714.741,42.661 711.657,38.004 708.048,33.937 L708.048,33.949 C701.18,27.055 693.006,24.458 683.614,23.154 L682.532,23.06 z"/>
  <path d="M348.925,120.402 C342.575,120.402 337.427,115.254 337.427,108.903 C337.427,102.553 342.575,97.405 348.925,97.405 C355.276,97.405 360.424,102.553 360.424,108.903 C360.424,115.254 355.276,120.402 348.925,120.402 z"/>
</svg>`;

const BASE_URL = "https://our.one";

/**
 * Wrap email content in the branded template.
 * Uses inline styles (email clients don't support external CSS).
 */
export function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our One</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFBF7;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">
          <!-- Logo -->
          <tr>
            <td style="padding-bottom: 32px;">
              <a href="${BASE_URL}" style="text-decoration: none;">
                ${LOGO_SVG}
              </a>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="font-family: 'Bitter', Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1.7; color: #0A0A0A;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; border-top: 1px solid #E8E4DD;">
              <p style="font-family: 'IBM Plex Sans', -apple-system, sans-serif; font-size: 12px; line-height: 1.5; color: #6B6B6B; margin: 0;">
                <a href="${BASE_URL}" style="color: #6B6B6B; text-decoration: none;">Our One</a> · Prague, 2026
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Branded black button for email CTAs.
 */
export function emailButton(text: string, href: string): string {
  const safeText = escapeHtml(text);
  const safeHref = escapeHtml(href);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
  <tr>
    <td style="background-color: #0A0A0A; border-radius: 8px;">
      <a href="${safeHref}" style="display: inline-block; padding: 14px 28px; font-family: 'IBM Plex Sans', -apple-system, sans-serif; font-size: 14px; font-weight: 500; color: #FDFBF7; text-decoration: none;">
        ${safeText}
      </a>
    </td>
  </tr>
</table>`;
}

/**
 * Notification footer with manage preferences link.
 */
export function emailNotificationFooter(): string {
  return `<p style="font-family: 'IBM Plex Sans', -apple-system, sans-serif; font-size: 12px; line-height: 1.5; color: #6B6B6B; margin: 16px 0 0;">
  You received this because of your <a href="${BASE_URL}/settings/notifications" style="color: #6B6B6B; text-decoration: underline;">notification settings</a>.
</p>`;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
