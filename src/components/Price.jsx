import React from 'react';

/**
 * Price component — symbol-only replacement to Euro.
 *
 * Behavior:
 * - If `amount` is a number: renders a localized EUR currency string using Intl.NumberFormat.
 *   (No currency conversion is performed; numeric value is used as-is.)
 * - If `amount` is a string and begins with a "$" sign (e.g. "$100" or "$1,000.00"):
 *   the leading "$" is replaced with "€" and the rest is left intact.
 * - Otherwise: attempts to render the string as-is prefixed with "€" as a safe fallback.
 *
 * Props:
 * - amount: number | string
 * - locale: optional Intl locale (defaults to 'en-IE' to show "€100.00")
 * - minimumFractionDigits: optional number (defaults to 2)
 */
const Price = ({ amount, locale = 'en-IE', minimumFractionDigits = 2 }) => {
  if (typeof amount === 'number' && !Number.isNaN(amount)) {
    return (
      <span className="price">
        {new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits,
        }).format(amount)}
      </span>
    );
  }

  if (typeof amount === 'string') {
    const trimmed = amount.trim();
    // Replace leading $ with €
    if (/^\$/.test(trimmed)) {
      return <span className="price">{trimmed.replace(/^\$/, '€')}</span>;
    }

    // If the string contains digits, attempt to parse and format
    const numeric = Number(trimmed.replace(/[^0-9\.\-]/g, ''));
    if (!Number.isNaN(numeric) && trimmed.match(/[0-9]/)) {
      return (
        <span className="price">
          {new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits,
          }).format(numeric)}
        </span>
      );
    }

    // Fallback: prefix with €
    return <span className="price">€{trimmed}</span>;
  }

  return <span className="price">€0.00</span>;
};

export default Price;