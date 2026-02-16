"use client";

/**
 * Check if notifications are supported in the browser
 */
export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

/**
 * Request notification permission from the user
 * Must be triggered by user action (button click)
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn("Notifications are not supported in this browser");
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}

/**
 * Check current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return "denied";
  }
  return Notification.permission;
}

/**
 * Show a notification
 * Only works if permission is "granted"
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported()) {
    console.warn("Notifications are not supported");
    return null;
  }

  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted");
    return null;
  }

  try {
    return new Notification(title, {
      icon: "/icon.png",
      badge: "/icon.png",
      ...options,
    });
  } catch (error) {
    console.error("Error showing notification:", error);
    return null;
  }
}

/**
 * Show route warning notification
 */
export function showRouteWarning(message: string): void {
  showNotification("Route Warning", {
    body: message,
    icon: "/icon.png",
    tag: "route-warning",
    requireInteraction: true,
  });
}

/**
 * Show time warning notification
 */
export function showTimeWarning(
  requestedHours: number,
  actualHours: number,
  excessHours: number
): void {
  showNotification("Trip Duration Alert", {
    body: `Your trip will take approximately ${actualHours}h, which is ${excessHours}h more than your requested ${requestedHours}h. Consider adjusting your route.`,
    icon: "/icon.png",
    tag: "time-warning",
    requireInteraction: true,
  });
}

/**
 * Show working hours warning notification
 */
export function showWorkingHoursWarning(placeName: string, reason: string): void {
  showNotification("Working Hours Alert", {
    body: `${placeName}: ${reason}`,
    icon: "/icon.png",
    tag: "working-hours-warning",
  });
}

/**
 * Show route ready notification
 */
export function showRouteReady(numberOfPlaces: number): void {
  showNotification("CairoCore", {
    body: `Your personalized route with ${numberOfPlaces} ${numberOfPlaces === 1 ? 'place' : 'places'} is ready!`,
    icon: "/icon.png",
    tag: "route-ready",
  });
}

/**
 * Show navigation started notification
 */
export function showNavigationStarted(destination: string): void {
  showNotification("Navigation Started", {
    body: `Navigating to ${destination}. Have a great trip!`,
    icon: "/icon.png",
    tag: "navigation-started",
  });
}

/**
 * Request permission if not already granted
 * Returns true if permission is granted
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  const currentPermission = getNotificationPermission();
  
  if (currentPermission === "granted") {
    return true;
  }

  if (currentPermission === "denied") {
    return false;
  }

  // Permission is "default", request it
  const permission = await requestNotificationPermission();
  return permission === "granted";
}




