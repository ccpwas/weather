import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'push-subscriptions.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function saveSubscription(sub: Subscription): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO subscriptions (endpoint, p256dh, auth) VALUES (?, ?, ?)');
    stmt.run([sub.endpoint, sub.keys.p256dh, sub.keys.auth], function(err) {
      if (err) reject(err);
      else resolve();
    });
    stmt.finalize();
  });
}

export function getAllSubscriptions(): Promise<Subscription[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT endpoint, p256dh, auth FROM subscriptions', (err, rows: any[]) => {
      if (err) reject(err);
      else {
        resolve(rows.map(row => ({
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth
          }
        })));
      }
    });
  });
}

export function removeSubscription(endpoint: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM subscriptions WHERE endpoint = ?', [endpoint], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
}
