import React from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

import {
  Profile,
  Container,
  HeaderContent,
  Header,
  Content,
  NextAppointment,
  Calendar,
  Schedule,
} from './styles';
import { useAuth } from '../../hooks/Auth';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logo} alt="GoBarber" />
          <Profile>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.avatar_url} />
            ) : (
              ''
            )}
            <div>
              <span> Bem vindo, </span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars2.githubusercontent.com/u/39229918?s=460&u=4766e610368f8b05b6779515ab3e81eacb7ca5fa&v=4"
                alt="Edmundo Ribeiro"
              />
              <strong>Edmundo Ribeiro</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>
        </Schedule>

        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
