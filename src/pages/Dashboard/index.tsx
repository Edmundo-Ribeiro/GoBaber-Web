import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { isToday, format, isWeekend, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

import {
  Profile,
  Container,
  HeaderContent,
  Header,
  Content,
  NextAppointment,
  Appointment,
  Calendar,
  Schedule,
  Section,
} from './styles';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  provider: {
    name: string;
    avatar_url: string;
  };
}

interface Schedule {
  morning: Appointment[];
  afternoon: Appointment[];
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then(response => {
        const adaptedAppointments = response.data.map(appointment => ({
          ...appointment,
          formattedHour: format(parseISO(appointment.date), 'HH:mm'),
        }));
        setAppointments(adaptedAppointments);
      });
  }, [selectedDate]);

  const disableDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return monthAvailability.reduce((disableDaysACC: Date[], monthDay) => {
      if (!monthDay.available) {
        disableDaysACC.push(new Date(year, month, monthDay.day));
      }
      return disableDaysACC;
    }, []);
  }, [currentMonth, monthAvailability]);

  const formattedDay = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  const dayOfWeek = useMemo(() => {
    return (
      format(selectedDate, 'cccc', {
        locale: ptBR,
      }) + (isWeekend(selectedDate) ? '' : '-feira')
    );
  }, [selectedDate]);

  const appointmentsSchedule = useMemo(() => {
    return appointments.reduce(
      (schedule: Schedule, appointment) => {
        parseISO(appointment.date).getHours() < 12
          ? schedule.morning.push(appointment)
          : schedule.afternoon.push(appointment);
        return schedule;
      },
      { morning: [], afternoon: [] },
    );
  }, [appointments]);

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
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
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
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{formattedDay}</span>
            <span>{dayOfWeek}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                {nextAppointment.provider.avatar_url && (
                  <img
                    src={nextAppointment.provider.avatar_url}
                    alt={nextAppointment.provider.name}
                  />
                )}
                <strong>{nextAppointment.provider.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {appointmentsSchedule.morning.length === 0 && (
              <p>Não há agendamentos para esse período</p>
            )}

            {appointmentsSchedule.morning.map(morningAppointment => (
              <Appointment key={morningAppointment.id}>
                <span>
                  <FiClock />
                  {morningAppointment.formattedHour}
                </span>

                <div>
                  {morningAppointment.provider.avatar_url && (
                    <img
                      src={morningAppointment.provider.avatar_url}
                      alt={morningAppointment.provider.name}
                    />
                  )}

                  <strong>{morningAppointment.provider.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {appointmentsSchedule.afternoon.length === 0 && (
              <p>Não há agendamentos para esse período</p>
            )}
            {appointmentsSchedule.afternoon.map(afternoonAppointment => (
              <Appointment key={afternoonAppointment.id}>
                <span>
                  <FiClock />
                  {afternoonAppointment.formattedHour}
                </span>

                <div>
                  {afternoonAppointment.provider.avatar_url && (
                    <img
                      src={afternoonAppointment.provider.avatar_url}
                      alt={afternoonAppointment.provider.name}
                    />
                  )}

                  <strong>{afternoonAppointment.provider.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
