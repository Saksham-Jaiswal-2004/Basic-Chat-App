import { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import { Avatar, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';

const App = () => {
  const [formData, setFormData] = useState({
    room: '',
    message: '',
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

    console.log("Sent");

    setFormData((currentData) => ({
      ...currentData,
      room: '',
      message: '',
    }));
  };

  const handleJoinRoom = () => {
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

  return (
    <Box className="relative min-h-screen overflow-hidden bg-[#07111f] px-4 py-10 text-slate-100" id="root">
      <Box className="pointer-events-none absolute inset-0">
        <Box className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <Box className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <Box className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <Box className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),_transparent_30%)]" />
      </Box>

      <Box className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <Paper
          elevation={16}
          className="relative flex w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-2xl backdrop-blur-xl"
        >
          <Box className="relative flex w-full flex-col overflow-hidden border border-white/5 bg-slate-950/40 p-6 sm:p-8 md:p-10">
            <Box className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-sky-500/10" />
            <Box className="relative z-10 flex min-h-0 flex-1 flex-col">
              <Box className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <Box className="grid w-full gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <Paper className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-sky-950/30">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#06b6d4', width: 46, height: 46, fontSize: 18 }}>
                        {socketId === 'Connecting...' ? '?' : socketId.slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" className="tracking-[0.25em] text-slate-400">
                          CURRENT USER ID
                        </Typography>
                        <Typography className="mt-1 break-all font-mono text-sm text-white">
                          {socketId}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 shadow-lg shadow-cyan-950/20">
                    <Typography variant="caption" className="tracking-[0.25em] text-cyan-200/80">
                      ACTIVE ROOM
                    </Typography>
                    <Typography className="mt-2 break-all text-lg font-semibold text-white">
                      {joinedRoom}
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              <Box className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <Paper className="h-full rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-xl shadow-black/20">
                  <Typography variant="overline" className="tracking-[0.35em] text-cyan-300/90">
                    ROOM CONTROL
                  </Typography>

                  <Box className="mt-4 grid gap-4">
                    <TextField
                      label="Room"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="filled"
                      placeholder="Enter room name"
                      inputProps={{
                        className: 'rounded-2xl bg-white/8 text-white',
                      }}
                      InputLabelProps={{ className: 'text-slate-300' }}
                    />

                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleJoinRoom}
                      className="rounded-full border-cyan-300/40 px-6 py-3 font-semibold text-cyan-100 hover:border-cyan-200 hover:bg-cyan-400/10"
                    >
                      Join Room
                    </Button>
                  </Box>

                  <Divider className="my-6 border-white/10" />

                  <Box className="grid gap-3 text-sm text-slate-300">
                    <Typography variant="overline" className="tracking-[0.35em] text-slate-400">
                      STATUS
                    </Typography>
                    <Typography>Socket connection and room details stay pinned here.</Typography>
                    <Typography>Message history scrolls independently on the right.</Typography>
                  </Box>
                </Paper>

                <Paper className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-xl shadow-black/20">
                  <Box className="flex items-center justify-between gap-3">
                    <Box>
                      <Typography variant="overline" className="tracking-[0.35em] text-cyan-300/90">
                        MESSAGES
                      </Typography>
                      <Typography className="mt-2 text-sm text-slate-300">
                        All incoming messages appear below. The list scrolls so the header and composer stay visible.
                      </Typography>
                    </Box>
                    <Typography className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {messages.length} total
                    </Typography>
                  </Box>

                  <Box className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                    <Stack spacing={2}>
                      {messages.length === 0 ? (
                        <Paper className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                          No messages yet. Join a room and start the conversation.
                        </Paper>
                      ) : (
                        messages.map((message, index) => {
                          const formattedMessage = formatMessage(message, index);

                          return (
                            <Paper
                              key={`${index}-${formattedMessage.title}`}
                              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                            >
                              <Typography className="text-sm leading-6 text-white">
                                {formattedMessage.title}
                              </Typography>
                              {formattedMessage.meta ? (
                                <Typography className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                                  {formattedMessage.meta}
                                </Typography>
                              ) : null}
                            </Paper>
                          );
                        })
                      )}
                    </Stack>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit} className="mt-5 grid gap-5">
                    <TextField
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      fullWidth
                      multiline
                      minRows={4}
                      variant="filled"
                      placeholder="Write your message..."
                      inputProps={{
                        className: 'rounded-2xl bg-white/8 text-white',
                      }}
                      InputLabelProps={{ className: 'text-slate-300' }}
                    />

                    <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <Typography className="text-sm text-slate-400">
                        Connected and ready to send.
                      </Typography>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 px-7 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-sky-300"
                      >
                        Send
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default App
