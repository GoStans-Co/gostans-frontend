import styled from 'styled-components';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Camera } from 'lucide-react';
import { CameraFilled } from '@ant-design/icons';
import { useApiServices } from '@/services/api';
import { message } from 'antd';
import { useState } from 'react';

type ProfileContentProps = {
    userData: {
        name?: string;
        email?: string;
        phone?: string;
    };
};

type ProfileField = {
    label: string;
    value: string | undefined;
    helperText?: string;
    hasButton?: boolean;
    buttonText?: string;
    buttonVariant?: 'outline' | 'primary';
};

const ProfileContentContainer = styled.div`
    width: 100%;
    max-width: 100%;

    ${({ theme }) => theme.responsive.maxMobile} {
        max-width: 100%;
    }
`;

const ProfileImageSection = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: row;
        align-items: flex-start;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const AvatarWrapper = styled.div`
    position: relative;
`;

const Avatar = styled.div<{ $hasImage?: string }>`
    width: 80px;
    height: 80px;
    border-radius: 20%;
    background-color: ${({ theme }) => theme.colors.primary || '#FF6B6B'};
    background-image: ${({ $hasImage }) => ($hasImage ? `url(${$hasImage})` : 'none')};
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
    flex-shrink: 0;

    svg {
        color: white;
        width: 40px;
        height: 40px;
    }

    &:hover {
        transform: scale(1.05);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 60px;
        height: 60px;

        svg {
            width: 30px;
            height: 30px;
        }
    }
`;

const AvatarOverlay = styled.div<{ show: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ show }) => (show ? 1 : 0)};
    transition: opacity 0.3s ease;
    cursor: pointer;

    svg {
        color: white;
        width: 24px;
        height: 24px;
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const ImageInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 70%;
    gap: ${({ theme }) => theme.spacing.xs};

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
    }
`;

const ImageTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};
    }
`;

const ImageDescription = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.muted || '#666'};
    margin: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        text-align: left;
    }
`;

const SectionHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    align-items: flex-start;
    display: flex;
    flex-direction: column;
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['2xl'] || '24px'};
    font-weight: 600;
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
    }
`;

const SectionSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.muted || '#666'};
    margin: 0;
    font-weight: 400;
`;

const FieldWrapper = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: flex-end;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: row;
        gap: ${({ theme }) => theme.spacing.sm};
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const FieldContent = styled.div`
    flex: 1;
`;

const ButtonWrapper = styled.div`
    margin-bottom: 22px;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 0;
    }
`;

const FieldHelper = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.muted || '#666'};
    margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }
`;

/**
 * ProfileContent - Sub Page Component
 * @description This component displays the user's profile information in a read-only format.
 * @param {ProfileContentProps} props - Props for the ProfileContent component
 */
export default function ManageAccountDetails({ userData }: ProfileContentProps) {
    const { user: userService } = useApiServices();
    const [messageApi, contextHolder] = message.useMessage();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const validateImageFile = (file: File): string | null => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return 'Invalid file type. Please upload a JPEG, PNG, or GIF image.';
        }
        if (file.size > 1 * 1024 * 1024) {
            return 'File size exceeds 1MB limit.';
        }
        return null;
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validationError = validateImageFile(file);
        if (validationError) {
            messageApi.error({
                content: validationError,
                duration: 3,
            });
            return;
        }

        try {
            const response = await userService.uploadProfileImage(file);

            if (response.success) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setProfileImage(e.target?.result as string);
                };
                reader.readAsDataURL(file);
                messageApi.success('Profile image updated successfully!');
            }
        } catch (error) {
            console.info('Image upload failed:', error);
            messageApi.error({
                content: 'Image upload failed. Please try again.',
                duration: 3,
            });
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('profile-image-upload')?.click();
    };
    const profileFields: ProfileField[] = [
        {
            label: 'Name',
            value: userData.name,
        },
        {
            label: 'Email',
            value: userData.email,
            helperText:
                "This is the email address you use to sign in. It's also where we send your booking confirmations.",
        },
        {
            label: 'Phone number',
            value: userData.phone || 'Not provided',
            helperText: 'Properties or attractions you book will use this number if they need to contact you.',
        },
        {
            label: 'Date of birth',
            value: 'Enter your date of birth',
        },
        {
            label: 'Nationality',
            value: "Select the country/region you're from",
        },
        {
            label: 'Address',
            value: 'Add your address',
        },
    ];

    const renderField = (field: ProfileField, index: number) => (
        <FieldWrapper key={index}>
            <FieldContent>
                <Input
                    label={field.label}
                    value={field.value}
                    readOnly
                    inputConfig={{
                        variant: 'outlined',
                        size: 'sm',
                    }}
                />
                {field.helperText && <FieldHelper>{field.helperText}</FieldHelper>}{' '}
            </FieldContent>
            {field.helperText ? (
                <ButtonWrapper key={index}>
                    <Button variant={field.buttonVariant || 'outline'} size="md">
                        {field.buttonText || 'Edit'}
                    </Button>
                </ButtonWrapper>
            ) : (
                <Button variant={field.buttonVariant || 'outline'} size="md">
                    {field.buttonText || 'Edit'}
                </Button>
            )}
        </FieldWrapper>
    );

    return (
        <>
            {contextHolder}
            <ProfileContentContainer>
                <SectionHeader>
                    <SectionTitle>Personal info</SectionTitle>
                    <SectionSubtitle>Provide your personal details.</SectionSubtitle>
                </SectionHeader>

                <ProfileImageSection>
                    <AvatarWrapper>
                        <Avatar
                            $hasImage={profileImage || undefined}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            onClick={handleAvatarClick}
                        >
                            {!profileImage && <CameraFilled />}
                            <AvatarOverlay show={isHovering}>
                                <Camera />
                            </AvatarOverlay>
                        </Avatar>
                        <HiddenFileInput
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </AvatarWrapper>
                    <ImageInfo>
                        <ImageTitle>Profile photo</ImageTitle>
                        <ImageDescription>
                            Upload a profile photo. Max file size: 1MB. Supported formats: JPG, PNG, GIF.
                        </ImageDescription>
                    </ImageInfo>
                </ProfileImageSection>

                {profileFields.map(renderField)}
            </ProfileContentContainer>
        </>
    );
}
