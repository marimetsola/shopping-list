db = db.getSiblingDB('shopping-list');
db.createUser({
  user: 'kauppalappu',
  pwd: 'kauppapassu123',
  roles: [{ role: 'readWrite', db: 'shopping-list' }],
});