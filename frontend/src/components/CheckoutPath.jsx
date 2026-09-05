import React from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PaymentIcon from '@mui/icons-material/Payment';
import '../CartStyles/CheckoutPath.css';

const steps = [
    { label: 'Shipping', icon: <LocalShippingIcon /> },
    { label: 'Confirm Order', icon: <FactCheckIcon /> },
    { label: 'Payment', icon: <PaymentIcon /> }
];

function CheckoutPath({ activeStep }) {
    return (
        <div className="checkoutPath">
            {steps.map((step, index) => (
                <div
                    className="checkoutPath-step"
                    key={step.label}
                    active={String(index === activeStep)}
                    completed={String(index < activeStep)}
                >
                    <div className="checkoutPath-icon">{step.icon}</div>
                    <span className="checkoutPath-label">{step.label}</span>
                </div>
            ))}
        </div>
    );
}

export default CheckoutPath;
