// Serverless function to forward contact form submissions to SendGrid
// Deploy on Vercel. Set SENDGRID_API_KEY in project environment variables.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const emailSubject = subject || 'General Inquiry';

        // Option 1: forward to a form endpoint (Formspree or similar)
        const FORM_ENDPOINT = process.env.FORM_ENDPOINT; // e.g. https://formspree.io/f/xyz
        if (FORM_ENDPOINT) {
            // Formspree and many form services expect form-encoded data or multipart FormData.
            // Send as application/x-www-form-urlencoded and include _replyto for proper reply handling.
            const params = new URLSearchParams();
            params.append('name', name);
            params.append('email', email);
            params.append('_subject', emailSubject);
            params.append('message', message);
            params.append('_replyto', email);

            const feRes = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
                body: params.toString(),
            });

            if (!feRes.ok) {
                const txt = await feRes.text();
                console.error('Form endpoint error', feRes.status, txt);
                return res.status(502).json({ error: 'Failed to forward to form endpoint', details: txt });
            }

            return res.status(200).json({ ok: true });
        }

        // Option 2: SendGrid fallback (if configured)
        const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
        if (!SENDGRID_API_KEY) {
            console.error('Missing SENDGRID_API_KEY and FORM_ENDPOINT');
            return res.status(500).json({ error: 'Email service not configured' });
        }

        // Prepare SendGrid request; deliver to the requested Gmail address
        const payload = {
            personalizations: [
                {
                    to: [
                        { email: 'neilkumar.dev@gmail.com' },
                        { email: 'luoan097@gmail.com' },
                        { email: 'jaylenli2010@gmail.com' }
                    ],
                    subject: `Findit AI Contact: ${emailSubject} — from ${name}`,
                },
            ],
            from: { email: 'no-reply@nsitllc.com', name: 'FindIt AI Site' },
            reply_to: { email, name },
            content: [
                {
                    type: 'text/plain',
                    value: `Name: ${name}\nEmail: ${email}\nSubject: ${emailSubject}\n\nMessage:\n${message}`,
                },
            ],
        };

        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!sgRes.ok) {
            const text = await sgRes.text();
            console.error('SendGrid error', sgRes.status, text);
            return res.status(502).json({ error: 'Failed to send email' });
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
}
