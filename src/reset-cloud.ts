async function resetCloud() {
  try {
    const response = await fetch('https://kvdb.io/6gQ8bW2uV7H3rPnGkWyZ/rickzinxx_avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'RESET',
    });
    if (response.ok) {
      console.log('Successfully reset the cloud avatar database!');
    } else {
      console.error('Failed to reset cloud database:', response.status);
    }
  } catch (err) {
    console.error('Error during reset:', err);
  }
}

resetCloud();
