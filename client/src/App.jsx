import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Avatar, Box, Button, Chip, Divider, Paper, Stack, TextField, Typography } from '@mui/material';

const App = () => {
  const [formData, setFormData] = useState({
    room: '',
    message: '',
    recipientId: '',
    privateMessage: '',
  });
  const [socketId, setSocketId] = useState('Connecting...');
  const [joinedRoom, setJoinedRoom] = useState('Not joined');
  const [messages, setMessages] = useState([]);

  const socket = useMemo(() => io('http://localhost:3000'), []);

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      console.log('Connected Successfully! User-ID:', socket.id);
    });

    // socket.on("Welcome", (message) => {
    //   console.log(message);
    // });

    socket.on('receive-message', (message) => {
      console.log(message);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off('connect');
      socket.off('receive-message');
      socket.disconnect();
    };
  }, [socket]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    socket.emit('message', {
      room: formData.room.trim(),
      message: formData.message.trim(),
    });

    setFormData((currentData) => ({
      ...currentData,
      message: '',
    }));
  };

  const handlePrivateSubmit = (event) => {
    event.preventDefault();

    socket.emit('message', {
      room: formData.recipientId.trim(),
      message: formData.privateMessage.trim(),
    });

    setFormData((currentData) => ({
      ...currentData,
      privateMessage: '',
    }));
  };

  const handleJoinRoom = (event) => {
    event.preventDefault();

    const room = formData.room.trim();

    if (!room) {
      return;
    }

    socket.emit('join-room', room);
    setJoinedRoom(room);
  };

  const formatMessage = (message, index) => {
    if (typeof message === 'string') {
      return { title: message, meta: '' };
    }

    if (message && typeof message === 'object') {
      return {
        title: message.message || message.text || JSON.stringify(message),
        meta: message.room || message.sender || message.name || '',
      };
    }

    return { title: String(message), meta: '' };
  };

  const darkFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: 'rgba(8, 15, 28, 0.75)',
      color: '#f8fafc',
      '& fieldset': {
        borderColor: 'rgba(148, 163, 184, 0.16)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(34, 211, 238, 0.35)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#22d3ee',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(203, 213, 225, 0.75)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#67e8f9',
    },
    '& .MuiInputBase-input': {
      color: '#f8fafc',
    },
  };

  const actionButtonStyles = {
    borderRadius: 999,
    px: 3,
    py: 1.35,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'none',
  };

  return (
    <Box
      id="root"
      sx={{
        position: 'relative',
        height: 'fit-content',
        overflow: 'hidden',
        px: { xs: 1.5, md: 3 },
        py: { xs: 1.5, md: 2.5 },
        color: '#e2e8f0',
        backgroundColor: '#040816',
        backgroundImage: `
          radial-gradient(circle at top left, rgba(34, 211, 238, 0.12), transparent 32%),
          radial-gradient(circle at 88% 12%, rgba(56, 189, 248, 0.10), transparent 26%),
          radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.12), transparent 30%),
          linear-gradient(180deg, #07111f 0%, #040816 100%)
        `,
      }}
    >
      <Box sx={{ pointerEvents: 'none', position: 'absolute', inset: 0 }}>
        <Box sx={{ position: 'absolute', left: '-6rem', top: '2rem', height: '18rem', width: '18rem', borderRadius: '999px', bgcolor: 'rgba(34, 211, 238, 0.12)', filter: 'blur(64px)' }} />
        <Box sx={{ position: 'absolute', right: '-3rem', top: '20%', height: '22rem', width: '22rem', borderRadius: '999px', bgcolor: 'rgba(56, 189, 248, 0.10)', filter: 'blur(64px)' }} />
        <Box sx={{ position: 'absolute', bottom: '-4rem', left: '30%', height: '20rem', width: '20rem', borderRadius: '999px', bgcolor: 'rgba(99, 102, 241, 0.12)', filter: 'blur(64px)' }} />
      </Box>

      <Box sx={{ position: 'relative', mx: 'auto', display: 'flex', height: '100%', width: '100%', maxWidth: 1440, alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          elevation={16}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: { xs: 5, md: 7 },
            border: '1px solid rgba(148, 163, 184, 0.10)',
            background: 'rgba(7, 15, 31, 0.72)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              minHeight: 0,
              p: { xs: 1.75, sm: 2.25, md: 3 },
              background: 'linear-gradient(180deg, rgba(3, 8, 20, 0.18), rgba(3, 8, 20, 0.48))',
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08), transparent 35%, rgba(99, 102, 241, 0.10))' }} />

            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  alignItems: 'center',
                  gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      mt: 0.75,
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      color: '#f8fafc',
                      fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.75rem' },
                      lineHeight: 1.05,
                    }}
                  >
                    Professional room chat and private messaging
                  </Typography>
                  <Typography sx={{ mt: 1, maxWidth: 860, color: 'rgba(203, 213, 225, 0.82)', lineHeight: 1.65, fontSize: { xs: '0.92rem', md: '0.98rem' } }}>
                    Join a room, send a room broadcast, or DM any user directly by socket ID. The interface stays focused,
                    dark, and responsive.
                  </Typography>
                </Box>

                <Paper
                  sx={{
                    borderRadius: 4,
                    border: '1px solid rgba(148, 163, 184, 0.10)',
                    background: 'rgba(2, 8, 23, 0.72)',
                    p: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#0ea5e9', width: 52, height: 52, fontSize: 18, fontWeight: 700 }}>
                      {socketId === 'Connecting...' ? '?' : socketId.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" sx={{ letterSpacing: '0.28em', color: 'rgba(148, 163, 184, 0.88)' }}>
                        CURRENT SOCKET
                      </Typography>
                      <Typography sx={{ mt: 0.5, wordBreak: 'break-all', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.95rem', color: '#f8fafc' }}>
                        {socketId}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
                    <Chip
                      label={`Room: ${joinedRoom}`}
                      sx={{ bgcolor: 'rgba(34, 211, 238, 0.10)', color: '#a5f3fc', border: '1px solid rgba(34, 211, 238, 0.18)' }}
                    />
                    <Chip
                      label={`${messages.length} messages`}
                      sx={{ bgcolor: 'rgba(99, 102, 241, 0.10)', color: '#c7d2fe', border: '1px solid rgba(99, 102, 241, 0.18)' }}
                    />
                  </Stack>
                </Paper>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', xl: '0.78fr 1.22fr' },
                  alignItems: 'start',
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <Stack spacing={2} sx={{ minHeight: 0 }}>
                  <Paper
                    sx={{
                      borderRadius: 4,
                      border: '1px solid rgba(148, 163, 184, 0.10)',
                      background: 'rgba(3, 8, 20, 0.66)',
                      p: { xs: 2, md: 2.25 },
                    }}
                  >
                    <Typography variant="overline" sx={{ letterSpacing: '0.34em', color: 'rgba(103, 232, 249, 0.9)' }}>
                      ROOM ACCESS
                    </Typography>
                    <Typography sx={{ mt: 1, color: 'rgba(203, 213, 225, 0.78)', lineHeight: 1.7 }}>
                      Enter a room name and join it before sending room messages.
                    </Typography>

                    <Box component="form" onSubmit={handleJoinRoom} sx={{ mt: 2, display: 'grid', gap: 1.5 }}>
                      <TextField
                        label="Room name"
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        required
                        fullWidth
                        placeholder="e.g. design-team"
                        sx={darkFieldStyles}
                      />

                      <Button type="submit" variant="contained" sx={{ ...actionButtonStyles, background: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 55%, #6366f1 100%)', color: '#06111f', '&:hover': { background: 'linear-gradient(135deg, #67e8f9 0%, #38bdf8 55%, #818cf8 100%)' } }}>
                        Join Room
                      </Button>
                    </Box>
                  </Paper>

                  <Paper
                    sx={{
                      borderRadius: 4,
                      border: '1px solid rgba(148, 163, 184, 0.10)',
                      background: 'rgba(3, 8, 20, 0.66)',
                      p: { xs: 2, md: 2.25 },
                    }}
                  >
                    <Typography variant="overline" sx={{ letterSpacing: '0.34em', color: 'rgba(103, 232, 249, 0.9)' }}>
                      ROOM BROADCAST
                    </Typography>
                    <Typography sx={{ mt: 1, color: 'rgba(203, 213, 225, 0.78)', lineHeight: 1.7 }}>
                      Send a message to everyone inside the selected room.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'grid', gap: 1.5 }}>
                      <TextField
                        label="Room message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Write a broadcast for the room..."
                        sx={darkFieldStyles}
                      />

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                        <Typography sx={{ color: 'rgba(148, 163, 184, 0.86)', fontSize: '0.92rem' }}>
                          Current room target: {formData.room || joinedRoom}
                        </Typography>
                        <Button type="submit" variant="contained" sx={{ ...actionButtonStyles, background: 'linear-gradient(135deg, #0f172a 0%, #111827 55%, #1e293b 100%)', color: '#e2e8f0', border: '1px solid rgba(148, 163, 184, 0.16)', '&:hover': { background: 'linear-gradient(135deg, #111827 0%, #0f172a 55%, #1e293b 100%)', borderColor: 'rgba(34, 211, 238, 0.35)' } }}>
                          Send Room Message
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Stack>

                <Stack spacing={2} sx={{ minHeight: 0 }}>
                  <Paper
                    sx={{
                      borderRadius: 4,
                      border: '1px solid rgba(148, 163, 184, 0.10)',
                      background: 'rgba(3, 8, 20, 0.66)',
                      p: { xs: 2, md: 2.25 },
                    }}
                  >
                    <Typography variant="overline" sx={{ letterSpacing: '0.34em', color: 'rgba(103, 232, 249, 0.9)' }}>
                      PRIVATE MESSAGE
                    </Typography>
                    <Typography sx={{ mt: 1, color: 'rgba(203, 213, 225, 0.78)', lineHeight: 1.7 }}>
                      Send a direct message to another user by entering their socket ID.
                    </Typography>

                    <Box component="form" onSubmit={handlePrivateSubmit} sx={{ mt: 2, display: 'grid', gap: 1.5 }}>
                      <TextField
                        label="Recipient socket ID"
                        name="recipientId"
                        value={formData.recipientId}
                        onChange={handleChange}
                        required
                        fullWidth
                        placeholder="Paste their socket ID"
                        sx={darkFieldStyles}
                      />

                      <TextField
                        label="Private message"
                        name="privateMessage"
                        value={formData.privateMessage}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Write something direct and private..."
                        sx={darkFieldStyles}
                      />

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                        <Typography sx={{ color: 'rgba(148, 163, 184, 0.86)', fontSize: '0.92rem' }}>
                          Uses the recipient ID as the delivery target.
                        </Typography>
                        <Button type="submit" variant="contained" sx={{ ...actionButtonStyles, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 55%, #1d4ed8 100%)', color: '#ecfeff', '&:hover': { background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 55%, #2563eb 100%)' } }}>
                          Send Private Message
                        </Button>
                      </Box>
                    </Box>
                  </Paper>

                  <Paper
                    sx={{
                      borderRadius: 4,
                      border: '1px solid rgba(148, 163, 184, 0.10)',
                      background: 'rgba(3, 8, 20, 0.66)',
                      p: { xs: 2, md: 2.25 },
                      minHeight: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      <Box>
                        <Typography variant="overline" sx={{ letterSpacing: '0.34em', color: 'rgba(103, 232, 249, 0.9)' }}>
                          CONVERSATION
                        </Typography>
                        <Typography sx={{ mt: 1, color: 'rgba(203, 213, 225, 0.78)', lineHeight: 1.7 }}>
                          Incoming messages appear here in real time.
                        </Typography>
                      </Box>
                      <Chip
                        label={`${messages.length} total`}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.14)' }}
                      />
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'rgba(148, 163, 184, 0.12)' }} />

                    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
                      <Stack spacing={1.5}>
                        {messages.length === 0 ? (
                          <Paper
                            sx={{
                              borderRadius: 3,
                              border: '1px dashed rgba(148, 163, 184, 0.18)',
                              bgcolor: 'rgba(255, 255, 255, 0.03)',
                              p: 2.5,
                              color: 'rgba(148, 163, 184, 0.9)',
                            }}
                          >
                            No messages yet. Join a room or send a private message to start the feed.
                          </Paper>
                        ) : (
                          messages.map((message, index) => {
                            const formattedMessage = formatMessage(message, index);

                            return (
                              <Paper
                                key={`${index}-${formattedMessage.title}`}
                                sx={{
                                  borderRadius: 3,
                                  border: '1px solid rgba(148, 163, 184, 0.10)',
                                  background: 'linear-gradient(180deg, rgba(8, 15, 28, 0.96), rgba(8, 15, 28, 0.72))',
                                  p: 2,
                                }}
                              >
                                <Typography sx={{ color: '#f8fafc', lineHeight: 1.75, fontSize: '0.96rem' }}>
                                  {formattedMessage.title}
                                </Typography>
                                {formattedMessage.meta ? (
                                  <Typography sx={{ mt: 1, color: 'rgba(148, 163, 184, 0.82)', fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                                    {formattedMessage.meta}
                                  </Typography>
                                ) : null}
                              </Paper>
                            );
                          })
                        )}
                      </Stack>
                    </Box>
                  </Paper>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default App;
