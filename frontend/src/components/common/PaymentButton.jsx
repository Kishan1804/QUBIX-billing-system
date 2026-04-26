import React from 'react'

const PaymentButton = ({ children, icon: Icon, ...props }) => {

    const handlePayment = async () => {
        try {
            // Create order via backend
            const response = await axios.post('/payment/create-order', {
                amount: inv.totalAmount, // Amount in rupees
                currency: 'INR',
            });

            const { id: order_id, amount, currency } = response.data;

            // Set up RazorPay options
            const options = {
                key: "rzp_test_62TA8n33wZh3IJ", // Replace with your RazorPay Key ID
                amount: amount,
                currency: currency,
                name: "Advance Billing System",
                description: "Test Transaction",
                order_id: order_id,
                handler: (response) => {
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                },
                prefill: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Payment initiation failed:', error);
        }
    };
    
    return (
        <button {...props} className={`transition-colors duration-300 ease-in-out h-10 px-3 py-2 rounded-lg inline-flex items-center justify-center gap-3 text-sm font-medium whitespace-nowrap`}>
            {Icon && (
                <Icon size={16} />
            )}
            {children}
        </button>
    )
}

export default PaymentButton