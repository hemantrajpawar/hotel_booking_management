import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

const steps = [
  'Guest Details',
  'Special Requests',
  'Payment Method Selection',
  'Payment Details',
  'Review & Confirm',
  'Booking Confirmation',
];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
  },
  [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

export default function BookingStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    dob: '',
    gender: '',
    nationality: '',
    numGuests: '',
    emergencyContact: '',
    emergencyContactNumber: '',
    paymentMethod: '',
    amount: '',
    transactionId: '',
    additionalNotes: '',
    paymentDetails: {
      gpay: { phoneNumber: '', upiId: '' },
      creditCard: { cardNumber: '', expiryDate: '', cvv: '' },
      razorpay: { orderId: '', paymentId: '', signature: '' },
      netBanking: { bankName: '', accountNumber: '' },
    }
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      paymentDetails: {
        ...formData.paymentDetails,
        [formData.paymentMethod]: {
          ...formData.paymentDetails[formData.paymentMethod],
          [name]: value,
        }
      }
    });
  };

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("image.jpg")', // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          minHeight: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust transparency of box
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: 2,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {activeStep === 0 && (
            <>
              <TextField label="Name" name="name" fullWidth margin="normal" onChange={handleChange} />
              <TextField label="Contact Number" name="contact" fullWidth margin="normal" onChange={handleChange} />
              <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
              <TextField label="Address" name="address" fullWidth margin="normal" onChange={handleChange} />
              <TextField
                label="Date of Birth (MM/DD/YY)"
                name="dob"
                type="text"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <Select name="paymentMethod" fullWidth value={formData.paymentMethod} onChange={handleChange}>
                <MenuItem value="gpay">GPay</MenuItem>
                <MenuItem value="creditCard">Credit Card</MenuItem>
                <MenuItem value="razorpay">Razorpay</MenuItem>
                <MenuItem value="netBanking">Net Banking</MenuItem>
              </Select>

              {formData.paymentMethod && (
                <>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                  />
                  <TextField
                    label="Transaction ID"
                    name="transactionId"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                  />
                </>
              )}

              {formData.paymentMethod === 'gpay' && (
                <>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                  <TextField
                    label="UPI ID"
                    name="upiId"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                </>
              )}

              {formData.paymentMethod === 'creditCard' && (
                <>
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                  <TextField
                    label="Expiry Date"
                    name="expiryDate"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                  <TextField
                    label="CVV"
                    name="cvv"
                    type="password"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                </>
              )}

              {formData.paymentMethod === 'razorpay' && (
                <>
                  <TextField
                    label="Order ID"
                    name="orderId"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                  <TextField
                    label="Payment ID"
                    name="paymentId"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                  <TextField
                    label="Signature"
                    name="signature"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                </>
              )}

              {formData.paymentMethod === 'netBanking' && (
                <>
                  <TextField
                    label="Bank Name"
                    name="bankName"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                  <TextField
                    label="Account Number"
                    name="accountNumber"
                    fullWidth
                    margin="normal"
                    onChange={handlePaymentDetailChange}
                  />
                </>
              )}
            </>
          )}

          {activeStep === 4 && (
            <TextField label="Additional Notes" name="additionalNotes" fullWidth margin="normal" onChange={handleChange} />
          )}

          {activeStep === 5 && (
            <Box sx={{ backgroundColor: 'LightGray', padding: 2, borderRadius: 1, textAlign: 'center', width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#333' }}>Booking Receipt</Typography>
              <Typography>Name: {formData.name || 'N/A'}</Typography>
              <Typography>Contact: {formData.contact || 'N/A'}</Typography>
              <Typography>Email: {formData.email || 'N/A'}</Typography>
              <Typography>Payment Method: {formData.paymentMethod || 'N/A'}</Typography>
              <Typography>Transaction ID: {formData.transactionId || 'N/A'}</Typography>
              <Typography>Amount: {formData.amount || 'N/A'}</Typography>
              {formData.paymentMethod === 'gpay' && (
                <>
                  <Typography>Phone Number: {formData.paymentDetails.gpay.phoneNumber}</Typography>
                  <Typography>UPI ID: {formData.paymentDetails.gpay.upiId}</Typography>
                </>
              )}
              {formData.paymentMethod === 'creditCard' && (
                <>
                  <Typography>Card Number: {formData.paymentDetails.creditCard.cardNumber}</Typography>
                  <Typography>Expiry Date: {formData.paymentDetails.creditCard.expiryDate}</Typography>
                </>
              )}
              {formData.paymentMethod === 'razorpay' && (
                <>
                  <Typography>Order ID: {formData.paymentDetails.razorpay.orderId}</Typography>
                  <Typography>Payment ID: {formData.paymentDetails.razorpay.paymentId}</Typography>
                </>
              )}
              {formData.paymentMethod === 'netBanking' && (
                <>
                  <Typography>Bank Name: {formData.paymentDetails.netBanking.bankName}</Typography>
                  <Typography>Account Number: {formData.paymentDetails.netBanking.accountNumber}</Typography>
                </>
              )}
              <Button variant="contained" sx={{ marginTop: 1 }} onClick={() => window.print()}>Download Receipt</Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 2 }}>
          {activeStep > 0 && <Button variant="outlined" onClick={handleBack}>Back</Button>}
          {activeStep < steps.length - 1 && <Button variant="contained" onClick={handleNext}>Next</Button>}
        </Box>
      </Box>
    </Stack>
  );
}
