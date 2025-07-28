import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Rating from "@mui/material/Rating";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NotesIcon from "@mui/icons-material/Notes";
import FeedbackIcon from "@mui/icons-material/Feedback";
import TaskIcon from "@mui/icons-material/Task";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import {
  User,
  GrowthSession,
  SessionDetails,
  Feedback,
  statusColors,
  statusLabels,
} from "@/app/(authenticated)/sessions/types";

interface SessionsTableProps {
  sessions: SessionDetails[];
  users: User[];
  onToggleExpanded: (sessionId: string) => void;
  onEdit: (session: GrowthSession) => void;
  onDelete: (sessionId: string, sessionTopic: string) => void;
  onFeedback: (sessionId: string, sessionTopic: string) => void;
  onNotes: (session: SessionDetails) => void;
}

const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  users,
  onToggleExpanded,
  onEdit,
  onDelete,
  onFeedback,
  onNotes,
}) => {
  const getUserName = (userId: string) => {
    if (!userId) return "Unassigned";
    const user = users.find((u) => u.id === userId);
    return user?.name || `User ID: ${userId}`;
  };

  const getAverageRating = (feedback: Feedback[]) => {
    if (!feedback || feedback.length === 0) return 0;
    return feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length;
  };

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell>
              <strong>Topic</strong>
            </TableCell>
            <TableCell>
              <strong>Presenter</strong>
            </TableCell>
            <TableCell>
              <strong>Scheduled Time</strong>
            </TableCell>
            <TableCell>
              <strong>Action Items</strong>
            </TableCell>
            <TableCell>
              <strong>Feedback</strong>
            </TableCell>
            <TableCell>
              <strong>Actions</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Details</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <React.Fragment key={session.id}>
              <TableRow hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {session.topic}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {session.presenter?.name || "N/A"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {new Date(session.scheduledTime).toLocaleString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TaskIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {session.actionItems?.length || 0} items
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {session.feedback && session.feedback.length > 0 ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating
                        value={getAverageRating(session.feedback)}
                        readOnly
                        size="small"
                        precision={0.1}
                      />
                      <Typography variant="caption" color="text.secondary">
                        ({session.feedback.length})
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No feedback yet
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit Session">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(session)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Session">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(session.id, session.topic)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Feedback">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => onFeedback(session.id, session.topic)}
                      >
                        <FeedbackIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Notes & Action Items">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onNotes(session)}
                      >
                        <NotesIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => onToggleExpanded(session.id)}
                    size="small"
                  >
                    {session.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} sx={{ p: 0 }}>
                  <Collapse in={session.expanded}>
                    <Box sx={{ p: 3, bgcolor: "grey.25" }}>
                      <Grid container spacing={3}>
                        {/* Notes Section */}
                        {session.notes && (
                          <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  color="primary"
                                >
                                  Session Notes
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ whiteSpace: "pre-wrap" }}
                                >
                                  {session.notes}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}

                        {/* Action Items Section */}
                        {session.actionItems &&
                          session.actionItems.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    color="primary"
                                  >
                                    Action Items
                                  </Typography>
                                  <Stack spacing={2}>
                                    {session.actionItems.map((item, index) => (
                                      <Box
                                        key={index}
                                        sx={{
                                          p: 2,
                                          bgcolor: "background.paper",
                                          borderRadius: 1,
                                          border: "1px solid",
                                          borderColor: "divider",
                                        }}
                                      >
                                        <Stack spacing={1}>
                                          <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                          >
                                            <Typography
                                              variant="subtitle2"
                                              fontWeight="medium"
                                            >
                                              {item.description}
                                            </Typography>
                                            <Chip
                                              label={statusLabels[item.status]}
                                              color={statusColors[item.status]}
                                              size="small"
                                            />
                                          </Box>
                                          <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                          >
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              Assigned to:{" "}
                                              {getUserName(item.assignedTo)}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              Due:{" "}
                                              {new Date(
                                                item.dueDate
                                              ).toLocaleDateString()}
                                            </Typography>
                                          </Box>
                                        </Stack>
                                      </Box>
                                    ))}
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Grid>
                          )}

                        {/* Feedback Section */}
                        {session.feedback && session.feedback.length > 0 && (
                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  color="primary"
                                >
                                  Session Feedback
                                </Typography>
                                <Grid container spacing={2}>
                                  {session.feedback
                                    .slice(-6)
                                    .map((feedback, index) => (
                                      <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={index}
                                      >
                                        <Box
                                          sx={{
                                            p: 2,
                                            bgcolor: "background.paper",
                                            borderRadius: 1,
                                            border: "1px solid",
                                            borderColor: "divider",
                                          }}
                                        >
                                          <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={1}
                                          >
                                            <Typography
                                              variant="subtitle2"
                                              fontWeight="medium"
                                            >
                                              {getUserName(feedback.userId)}
                                            </Typography>
                                            <Rating
                                              value={feedback.rating}
                                              readOnly
                                              size="small"
                                            />
                                          </Box>
                                          {feedback.comments && (
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              &quot;{feedback.comments}&quot;
                                            </Typography>
                                          )}
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            mt={1}
                                          >
                                            {new Date(
                                              feedback.createdAt
                                            ).toLocaleDateString()}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    ))}
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionsTable;
