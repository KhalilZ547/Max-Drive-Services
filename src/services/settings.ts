
'use server';

import db from '@/lib/db';

/**
 * Fetches all settings from the database and returns them as a key-value object.
 * @returns {Promise<Record<string, string>>} An object containing all site settings.
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const [rows] = await db.execute('SELECT setting_key, setting_value FROM site_settings');
    
    const settings = (rows as { setting_key: string; setting_value: string }[]).reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {} as Record<string, string>);

    return settings;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    // Return an empty object in case of an error to prevent site crashes
    return {};
  }
}

/**
 * Updates multiple settings in the database.
 * @param {Record<string, any>} settings - An object where keys are setting_key and values are the new setting_value.
 */
export async function updateSettings(settings: Record<string, any>): Promise<void> {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const updatePromises = Object.entries(settings).map(([key, value]) => {
      // Using INSERT ... ON DUPLICATE KEY UPDATE is an efficient way to handle both new and existing settings.
      const sql = 'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)';
      return connection.execute(sql, [key, value]);
    });

    await Promise.all(updatePromises);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Failed to update settings:", error);
    throw new Error("Database transaction failed while updating settings.");
  } finally {
    connection.release();
  }
}
