import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function createAdmin() {
  try {
    console.log('Authenticating as superuser...');
    await pb.collection('_superusers').authWithPassword('admin@example.com', 'password123456');

    console.log('Creating frontend admin user in "users" collection...');
    const user = await pb.collection('users').create({
      email: 'admin@example.com',
      emailVisibility: true,
      password: 'password123456',
      passwordConfirm: 'password123456',
      role: 'admin',
    });

    console.log('Success! Frontend admin user created:', user.email);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response details:', error.response.data);
    }
  }
}

createAdmin();
