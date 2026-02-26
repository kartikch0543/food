const bcrypt = require('bcryptjs');

async function test() {
    try {
        const password = 'testpassword';
        console.log('Original Password:', password);

        const hash = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hash);

        const match = await bcrypt.compare(password, hash);
        console.log('Match?', match);

        process.exit(0);
    } catch (err) {
        console.error('Bcrypt Test Failed:', err);
        process.exit(1);
    }
}

test();
