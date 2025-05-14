import styled from 'styled-components';
import Sidebar from './Sidebar';
import ProfileContent from './ProfileContent';

const PageContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.grayBackground};
`;

export default function MyPage() {
    const userData = {
        name: 'Kholikov Oybek',
        email: 'example@example.com',
        phone: '01012345678',
        joinDate: 'Mar 2025',
    };

    return (
        <PageContainer>
            <Sidebar userName={userData.name} joinDate={userData.joinDate} activePage="profile" />
            <ProfileContent userData={userData} />
        </PageContainer>
    );
}
