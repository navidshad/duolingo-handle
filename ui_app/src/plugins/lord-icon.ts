import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";

/**
 * Example usage:
 * <lord-icon trigger="hover" src="/my-icon.json"></lord-icon>
 */

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);
