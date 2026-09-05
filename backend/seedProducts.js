// Seeds a handful of sample products using the images already bundled in
// frontend/public/images, so the storefront isn't empty out of the box.
// Run from the project root: node backend/seedProducts.js
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });
import mongoose from 'mongoose';
import Product from './model/productModel.js';
import User from './model/userModel.js';
import connectMongoDatabase from './config/db.js';

const products = [
    {
        name: 'Nomida Bijoux Shimmer Lip Gloss - Rose Gold',
        description: 'A high-shine, non-sticky lip gloss with a rose gold shimmer finish. Lightweight, buildable coverage that lasts all day.',
        price: 499,
        category: 'Beauty',
        stock: 30,
        images: [{ public_id: 'seed/product1', url: '/images/product1.jpg' }]
    },
    {
        name: 'Nomida Bijoux Shimmer Lip Gloss - Nude Blush',
        description: 'The same high-shine formula in a softer nude blush shade, perfect for everyday wear.',
        price: 449,
        category: 'Beauty',
        stock: 25,
        images: [{ public_id: 'seed/product1b', url: '/images/product1.jpg' }]
    },
    {
        name: '793 Karats - Fire in the Dark Eau de Parfum',
        description: 'A bold, smoky fragrance with notes of amber, oud and warm spice in a sleek black glass bottle. 50ml.',
        price: 3499,
        category: 'Fragrance',
        stock: 15,
        images: [{ public_id: 'seed/product2', url: '/images/product2.jpg' }]
    },
    {
        name: 'Crocodile-Embossed Mini Tote Bag',
        description: 'A structured mini tote in croc-embossed leather with polished gold hardware. Available in black and emerald green.',
        price: 5999,
        category: 'Bags',
        stock: 10,
        images: [{ public_id: 'seed/product3', url: '/images/product3.jpg' }]
    },
    {
        name: 'Crystal Bloom Slingback Heels',
        description: 'Sheer mesh slingback heels finished with a hand-beaded crystal flower and a sculpted kitten heel.',
        price: 2799,
        category: 'Footwear',
        stock: 20,
        images: [{ public_id: 'seed/product4', url: '/images/product4.jpg' }]
    },
    {
        name: 'Radiant Rose Eau de Parfum',
        description: 'A lighter, rose-forward take on our signature fragrance line, in the same statement glass bottle. 50ml.',
        price: 2899,
        category: 'Fragrance',
        stock: 12,
        images: [{ public_id: 'seed/product2b', url: '/images/product2.jpg' }]
    },
    {
        name: 'Velvet Matte Liquid Lipstick',
        description: 'A budget-friendly everyday matte lipstick with a soft-focus, transfer-resistant finish.',
        price: 349,
        category: 'Beauty',
        stock: 40,
        images: [{ public_id: 'seed/product1c', url: '/images/product1.jpg' }]
    },
    {
        name: 'Dewy Glow Highlighter Stick',
        description: 'A creamy, blendable highlighter stick for a lit-from-within glow. Buildable from subtle to full-on sheen.',
        price: 599,
        category: 'Beauty',
        stock: 22,
        images: [{ public_id: 'seed/product1d', url: '/images/product1.jpg' }]
    },
    {
        name: 'Silk Finish Setting Powder',
        description: 'A translucent, blurring setting powder that locks in makeup for up to 12 hours without caking.',
        price: 799,
        category: 'Beauty',
        stock: 18,
        images: [{ public_id: 'seed/product1e', url: '/images/product1.jpg' }]
    },
    {
        name: 'Noir Intense Eau de Parfum',
        description: 'A deep, opulent fragrance layering black vanilla, patchouli and dark cherry. 100ml.',
        price: 4299,
        category: 'Fragrance',
        stock: 10,
        images: [{ public_id: 'seed/product2c', url: '/images/product2.jpg' }]
    },
    {
        name: 'Citrus Bloom Eau de Toilette',
        description: 'A fresh, everyday scent with sparkling bergamot, neroli and a soft musk base. 50ml.',
        price: 1999,
        category: 'Fragrance',
        stock: 20,
        images: [{ public_id: 'seed/product2d', url: '/images/product2.jpg' }]
    },
    {
        name: 'Quilted Chain Shoulder Bag',
        description: 'A classic quilted shoulder bag on a polished chain strap - a versatile everyday-to-evening staple.',
        price: 7499,
        category: 'Bags',
        stock: 8,
        images: [{ public_id: 'seed/product3b', url: '/images/product3.jpg' }]
    },
    {
        name: 'Structured Top-Handle Satchel',
        description: 'A boxy top-handle satchel in smooth vegan leather with a detachable crossbody strap.',
        price: 6299,
        category: 'Bags',
        stock: 9,
        images: [{ public_id: 'seed/product3c', url: '/images/product3.jpg' }]
    },
    {
        name: 'Woven Straw Beach Tote',
        description: 'An oversized hand-woven straw tote, perfect for summer days and vacations.',
        price: 2499,
        category: 'Bags',
        stock: 15,
        images: [{ public_id: 'seed/product3d', url: '/images/product3.jpg' }]
    },
    {
        name: 'Pearl-Strap Block Heels',
        description: 'Comfortable block heels finished with a delicate pearl-embellished ankle strap.',
        price: 3299,
        category: 'Footwear',
        stock: 16,
        images: [{ public_id: 'seed/product4b', url: '/images/product4.jpg' }]
    },
    {
        name: 'Diamante Ankle-Strap Sandals',
        description: 'Strappy sandals with all-over diamante embellishment and a comfortable low heel.',
        price: 2199,
        category: 'Footwear',
        stock: 18,
        images: [{ public_id: 'seed/product4c', url: '/images/product4.jpg' }]
    }
];

connectMongoDatabase();
mongoose.connection.once('open', async () => {
    try {
        const user = await User.findOne();
        if (!user) {
            console.log('No users found - register at least one user before seeding products.');
            process.exit(1);
        }
        for (const p of products) {
            const exists = await Product.findOne({ name: p.name });
            if (exists) {
                console.log(`Skipping (already exists): ${p.name}`);
                continue;
            }
            await Product.create({ ...p, user: user._id });
            console.log(`Created: ${p.name}`);
        }
        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.log('Seeding failed:', error.message);
        process.exit(1);
    }
});
