import { useCallback, useEffect, useState } from 'react';

type CardDetails = {
    cardNumber: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
    saveDetails: boolean;
};

type LeadGuestFormData = {
    fullName: string;
    email: string;
    confirmEmail: string;
    phoneNumber: string;
    dateOfBirth: string;
};

type ValidationErrors = {
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
    nameOnCard?: string;
    fullName?: string;
    email?: string;
    confirmEmail?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
};

type FormType = 'card' | 'leadGuest';

export const useValidation = (formType: FormType = 'card') => {
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardNumber: '',
        expiry: '',
        cvv: '',
        nameOnCard: '',
        saveDetails: false,
    });
    const [leadGuestData, setLeadGuestData] = useState<LeadGuestFormData>({
        fullName: '',
        email: '',
        confirmEmail: '',
        phoneNumber: '',
        dateOfBirth: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (cardDetails.cardNumber && cardDetails.cvv && cardDetails.expiry && cardDetails.nameOnCard) {
            setCardDetails((prev) => ({
                ...prev,
                saveDetails: true,
            }));
        }
    }, [cardDetails.cardNumber, cardDetails.expiry, cardDetails.cvv, cardDetails.nameOnCard]);

    /**
     * Formats card details for display and validation.
     * - Card number: groups into 4-digit blocks
     * - Expiry: formats as MM/YY
     * - CVV: ensures only digits and limits length
     */
    const formatCardNumber = (value: string): string => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join('-');
        } else {
            return v;
        }
    };

    const formatExpiry = (value: string): string => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const formatCVV = (value: string): string => {
        return value.replace(/\D/g, '').slice(0, 4);
    };

    const detectCardType = (cardNumber: string): string => {
        const number = cardNumber.replace(/[-\s]/g, '');
        if (number.match(/^4/)) return 'visa';
        if (number.match(/^5[1-5]/)) return 'mastercard';
        if (number.match(/^3[47]/)) return 'amex';
        if (number.match(/^6/)) return 'discover';
        return 'unknown';
    };

    const validateCardNumber = (cardNumber: string): boolean => {
        const number = cardNumber.replace(/[-\s]/g, '');
        if (number.length < 13 || number.length > 19) return false;

        let sum = 0;
        let isEven = false;

        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    const validateExpiry = (expiry: string): boolean => {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

        const [month, year] = expiry.split('/').map(Number);
        if (month < 1 || month > 12) return false;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }

        return true;
    };

    const validateCVV = (cvv: string, cardType: string): boolean => {
        if (cardType === 'amex') {
            return /^\d{4}$/.test(cvv);
        }
        return /^\d{3}$/.test(cvv);
    };

    const validateNameOnCard = (name: string): boolean => {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    };

    /**
     * Lead guest validation functions
     * - Full name: must be at least 2 characters, letters and spaces only
     * - Email: must match standard email format
     * - Phone number: must be between 7 and 15 digits, allowing for formatting
     * - Date of birth: must be in DD/MM/YYYY format, valid date, and reasonable age range
     */
    const validateFullName = (name: string): boolean => {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 7 && cleanPhone.length <= 15;
    };

    const validateDateOfBirth = (date: string): boolean => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(date)) return false;

        const [day, month, year] = date.split('/').map(Number);

        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        const currentYear = new Date().getFullYear();
        if (year < currentYear - 120 || year > currentYear - 1) return false;

        const dateObj = new Date(year, month - 1, day);
        return dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year;
    };

    const formatDateOfBirth = (value: string): string => {
        const digits = value.replace(/\D/g, '');

        if (digits.length <= 2) {
            return digits;
        } else if (digits.length <= 4) {
            return `${digits.substring(0, 2)}/${digits.substring(2)}`;
        } else {
            return `${digits.substring(0, 2)}/${digits.substring(2, 4)}/${digits.substring(4, 8)}`;
        }
    };

    const formatPhoneNumber = (value: string): string => {
        return value.replace(/[^\d]/g, '');
    };

    /**
     * Handle changes for card details and lead guest data
     * - Formats input values
     * - Validates each field
     * - Updates state and errors accordingly
     */
    const handleCardDetailsChange = useCallback(
        (field: keyof CardDetails, value: string | boolean) => {
            if (typeof value === 'boolean') {
                setCardDetails((prev) => ({ ...prev, [field]: value }));
                return;
            }

            let formattedValue = value;
            let error = '';

            switch (field) {
                case 'cardNumber':
                    formattedValue = formatCardNumber(value);
                    if (formattedValue && !validateCardNumber(formattedValue)) {
                        error = 'Please enter a valid card number';
                    }
                    break;

                case 'expiry':
                    formattedValue = formatExpiry(value);
                    if (formattedValue.length === 5 && !validateExpiry(formattedValue)) {
                        error = 'Please enter a valid expiry date';
                    }
                    break;

                case 'cvv':
                    formattedValue = formatCVV(value);
                    const cardType = detectCardType(cardDetails.cardNumber);
                    if (formattedValue && !validateCVV(formattedValue, cardType)) {
                        error = cardType === 'amex' ? 'CVV must be 4 digits' : 'CVV must be 3 digits';
                    }
                    break;

                case 'nameOnCard':
                    formattedValue = value;
                    if (formattedValue && !validateNameOnCard(formattedValue)) {
                        error = 'Please enter a valid name';
                    }
                    break;
            }

            setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
            setErrors((prev) => ({ ...prev, [field]: error }));
        },
        [cardDetails.cardNumber],
    );

    const handleLeadGuestChange = useCallback(
        (field: keyof LeadGuestFormData, value: string) => {
            let formattedValue = value;
            let error = '';

            switch (field) {
                case 'fullName':
                    if (value && !validateFullName(value)) {
                        error = 'Please enter a valid full name (letters and spaces only)';
                    }
                    break;

                case 'email':
                    if (value && !validateEmail(value)) {
                        error = 'Please enter a valid email address';
                    }
                    break;

                case 'confirmEmail':
                    if (value && value !== leadGuestData.email) {
                        error = 'Email addresses do not match';
                    } else if (value && !validateEmail(value)) {
                        error = 'Please enter a valid email address';
                    }
                    break;

                case 'phoneNumber':
                    formattedValue = formatPhoneNumber(value);
                    if (formattedValue && !validatePhoneNumber(formattedValue)) {
                        error = 'Please enter a valid phone number';
                    }
                    break;

                case 'dateOfBirth':
                    formattedValue = formatDateOfBirth(value);
                    if (formattedValue.length === 10 && !validateDateOfBirth(formattedValue)) {
                        error = 'Please enter a valid date of birth (DD/MM/YYYY)';
                    }
                    break;
            }

            setLeadGuestData((prev) => ({ ...prev, [field]: formattedValue }));
            setErrors((prev) => ({ ...prev, [field]: error }));

            if (field === 'email' && leadGuestData.confirmEmail) {
                if (formattedValue !== leadGuestData.confirmEmail) {
                    setErrors((prev) => ({ ...prev, confirmEmail: 'Email addresses do not match' }));
                } else {
                    setErrors((prev) => ({ ...prev, confirmEmail: '' }));
                }
            }
        },
        [leadGuestData.email, leadGuestData.confirmEmail],
    );

    /**
     * Validates all fields in the current form type (card or lead guest).
     */
    const validateAllFields = useCallback((): boolean => {
        const newErrors: ValidationErrors =
            formType === 'card'
                ? {
                      cardNumber: !validateCardNumber(cardDetails.cardNumber)
                          ? 'Please enter a valid card number'
                          : undefined,
                      expiry: !validateExpiry(cardDetails.expiry) ? 'Please enter a valid expiry date' : undefined,
                      cvv: !validateCVV(cardDetails.cvv, detectCardType(cardDetails.cardNumber))
                          ? detectCardType(cardDetails.cardNumber) === 'amex'
                              ? 'CVV must be 4 digits'
                              : 'CVV must be 3 digits'
                          : undefined,
                      nameOnCard: !validateNameOnCard(cardDetails.nameOnCard) ? 'Please enter a valid name' : undefined,
                  }
                : {
                      fullName: !validateFullName(leadGuestData.fullName)
                          ? 'Please enter a valid full name'
                          : undefined,
                      email: !validateEmail(leadGuestData.email) ? 'Please enter a valid email address' : undefined,
                      confirmEmail:
                          leadGuestData.email !== leadGuestData.confirmEmail
                              ? 'Email addresses do not match'
                              : !validateEmail(leadGuestData.confirmEmail)
                                ? 'Please enter a valid email address'
                                : undefined,
                      phoneNumber: !validatePhoneNumber(leadGuestData.phoneNumber)
                          ? 'Please enter a valid phone number'
                          : undefined,
                      dateOfBirth: !validateDateOfBirth(leadGuestData.dateOfBirth)
                          ? 'Please enter a valid date of birth (DD/MM/YYYY)'
                          : undefined,
                  };

        const filteredErrors = Object.fromEntries(
            Object.entries(newErrors).filter(([_, value]) => value !== undefined),
        );
        setErrors(filteredErrors);
        return Object.keys(filteredErrors).length === 0;
    }, [formType, cardDetails, leadGuestData]);
    /**
     * Resets the card form fields to their initial state.
     */
    const resetCardForm = useCallback(() => {
        setCardDetails({
            cardNumber: '',
            expiry: '',
            cvv: '',
            nameOnCard: '',
            saveDetails: false,
        });
    }, []);

    const resetLeadGuestForm = useCallback(() => {
        setLeadGuestData({
            fullName: '',
            email: '',
            confirmEmail: '',
            phoneNumber: '',
            dateOfBirth: '',
        });
    }, []);

    const resetErrors = useCallback(() => {
        setErrors({});
    }, []);

    const resetAll = useCallback(() => {
        resetCardForm();
        resetLeadGuestForm();
        resetErrors();
    }, []);

    return {
        cardDetails,
        handleCardDetailsChange,
        detectCardType,

        leadGuestData,
        handleLeadGuestChange,

        errors,
        validateAllFields, // memoized function
        resetAll,
        resetCardForm,
        resetLeadGuestForm,
        resetErrors,
    };
};
