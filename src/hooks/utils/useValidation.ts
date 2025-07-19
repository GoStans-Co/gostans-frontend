import { BillingInfo } from '@/services/api/checkout';
import { useCallback, useEffect, useState } from 'react';

type CardDetails = {
    cardNumber: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
    saveDetails: boolean;
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
    firstName?: string;
    lastName?: string;
    postalCode?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
};

type FormType = 'card' | 'billing' | 'cart';

export const useValidation = (formType: FormType = 'card') => {
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardNumber: '',
        expiry: '',
        cvv: '',
        nameOnCard: '',
        saveDetails: false,
    });

    const [billingInfo, setBillingInfo] = useState<BillingInfo>({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [cartValidationErrors, setCartValidationErrors] = useState<{ [itemId: string]: string }>({});

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
     * Billing information validation functions
     */
    const validateName = (name: string): boolean => {
        return name.trim().length >= 2 && /^[a-zA-Z\s-]+$/.test(name.trim());
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 7 && cleanPhone.length <= 15;
    };

    const validateAddress = (address: string): boolean => {
        return address.trim().length >= 5;
    };

    const validateCity = (city: string): boolean => {
        return city.trim().length >= 2 && /^[a-zA-Z\s-]+$/.test(city.trim());
    };

    const validateState = (state: string): boolean => {
        return state.trim().length >= 2;
    };

    const validatePostalCode = (postalCode: string): boolean => {
        return postalCode.trim().length >= 3;
    };

    const validateCountry = (country: string): boolean => {
        return country.trim().length >= 2;
    };

    const formatPhoneNumber = (value: string): string => {
        return value.replace(/[^\d]/g, '');
    };

    /**
     * Cart validation functions
     */
    const validateCartItem = (
        selectedDate: Date | null,
        guestCounts: { adults: number; children: number; infants: number },
        isFamilyPackage: boolean,
        isFirstItem: boolean,
    ): string[] => {
        const errorMessages = [];

        if (!selectedDate) {
            errorMessages.push('Please select a date');
        }

        const totalGuests = guestCounts.adults + guestCounts.children + guestCounts.infants;

        if (totalGuests === 0) {
            errorMessages.push('Please select at least one guest');
        }

        if (isFamilyPackage && isFirstItem && totalGuests < 3) {
            errorMessages.push('Family package requires minimum 3 guests');
        }

        return errorMessages;
    };
    /**
     * Validates the entire cart.
     */
    const validateCart = useCallback(
        (
            cartItems: any[],
            selectedDates: { [itemId: string]: Date | null },
            guestCounts: { [itemId: string]: { adults: number; children: number; infants: number } },
            isFamilyPackage: boolean,
        ): boolean => {
            const errors: { [itemId: string]: string } = {};
            let isValid = true;

            cartItems.forEach((item, index) => {
                const counts = guestCounts[item.tourId] || { adults: 1, children: 0, infants: 0 };
                const errorMessages = validateCartItem(
                    selectedDates[item.tourId],
                    counts,
                    isFamilyPackage,
                    index === 0,
                );

                if (errorMessages.length > 0) {
                    errors[item.tourId] = errorMessages.join('. ');
                    isValid = false;
                }
            });

            setCartValidationErrors(errors);
            return isValid;
        },
        [],
    );

    /**
     * Handle changes for card details
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

    /**
     * Handle changes for billing information
     */
    const handleBillingChange = useCallback((field: keyof BillingInfo, value: string) => {
        let formattedValue = value;
        let error = '';

        switch (field) {
            case 'firstName':
            case 'lastName':
                if (value && !validateName(value)) {
                    error = 'Please enter a valid name (letters, spaces, and hyphens only)';
                }
                break;

            case 'email':
                if (value && !validateEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                formattedValue = formatPhoneNumber(value);
                if (formattedValue && !validatePhoneNumber(formattedValue)) {
                    error = 'Please enter a valid phone number';
                }
                break;

            case 'address':
                if (value && !validateAddress(value)) {
                    error = 'Please enter a valid address';
                }
                break;

            case 'city':
                if (value && !validateCity(value)) {
                    error = 'Please enter a valid city name';
                }
                break;

            case 'state':
                if (value && !validateState(value)) {
                    error = 'Please enter a valid state';
                }
                break;

            case 'postalCode':
                if (value && !validatePostalCode(value)) {
                    error = 'Please enter a valid postal code';
                }
                break;

            case 'country':
                if (value && !validateCountry(value)) {
                    error = 'Please enter a valid country';
                }
                break;
        }

        setBillingInfo((prev) => ({ ...prev, [field]: formattedValue }));
        setErrors((prev) => ({ ...prev, [field]: error }));
    }, []);

    /**
     * Validates all fields in the current form type.
     */
    const validateAllFields = useCallback((): boolean => {
        let newErrors: ValidationErrors = {};

        if (formType === 'card') {
            newErrors = {
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
            };
        } else if (formType === 'billing') {
            newErrors = {
                firstName: !validateName(billingInfo.firstName) ? 'Please enter a valid first name' : undefined,
                lastName: !validateName(billingInfo.lastName) ? 'Please enter a valid last name' : undefined,
                email: !validateEmail(billingInfo.email) ? 'Please enter a valid email address' : undefined,
                phone: !validatePhoneNumber(billingInfo.phone) ? 'Please enter a valid phone number' : undefined,
                address: !validateAddress(billingInfo.address) ? 'Please enter a valid address' : undefined,
                city: !validateCity(billingInfo.city) ? 'Please enter a valid city' : undefined,
                state: !validateState(billingInfo.state) ? 'Please enter a valid state' : undefined,
                postalCode: !validatePostalCode(billingInfo.postalCode)
                    ? 'Please enter a valid postal code'
                    : undefined,
                country: !validateCountry(billingInfo.country) ? 'Please enter a valid country' : undefined,
            };
        } else if (formType === 'cart') {
            return Object.keys(cartValidationErrors).length === 0;
        }

        const filteredErrors = Object.fromEntries(
            Object.entries(newErrors).filter(([_, value]) => value !== undefined),
        );
        setErrors(filteredErrors);
        return Object.keys(filteredErrors).length === 0;
    }, [formType, cardDetails, billingInfo, cartValidationErrors]);

    /**
     * Reset functions
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

    const resetBillingForm = useCallback(() => {
        setBillingInfo({
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            email: '',
            phone: '',
        });
    }, []);

    const resetErrors = useCallback(() => {
        setErrors({});
    }, []);

    const resetCartValidation = useCallback(() => {
        setCartValidationErrors({});
    }, []);

    const resetAll = useCallback(() => {
        resetCardForm();
        resetBillingForm();
        resetErrors();
        resetCartValidation();
    }, []);

    return {
        cardDetails,
        handleCardDetailsChange,
        detectCardType,

        billingInfo,
        handleBillingChange,

        cartValidationErrors,
        validateCart,
        resetCartValidation,

        errors,
        validateAllFields,
        resetAll,
        resetCardForm,
        resetBillingForm,
        resetErrors,
    };
};
