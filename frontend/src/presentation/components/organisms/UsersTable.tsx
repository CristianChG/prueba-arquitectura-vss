import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Typography,
  TablePagination,
  LinearProgress,
  TableSortLabel,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UsersAPI, type User, type Pagination } from '../../../infrastructure/api/UsersAPI';
import { ROLES, ROLE_LABELS } from '@constants/roles';
import { useAuth } from '../../../app/hooks/useAuth';

interface UsersTableProps {
  search: string;
  roleFilter: number | '';
}

export const UsersTable: React.FC<UsersTableProps> = ({ search, roleFilter }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement | null;
    user: User | null;
  }>({
    anchorEl: null,
    user: null,
  });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [orderBy, setOrderBy] = useState<string>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UsersAPI.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        role: roleFilter !== '' ? roleFilter : undefined,
        sortBy: orderBy,
        sortOrder: order,
      });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, roleFilter, orderBy, order]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [search, roleFilter]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation();
    setMenuState({
      anchorEl: event.currentTarget,
      user: user,
    });
  }, []);

  const handleMenuClose = useCallback(() => {
    // Only clear anchorEl immediately, keep user for animation
    setMenuState((prev) => ({
      ...prev,
      anchorEl: null,
    }));
    // Clear user after animation completes
    setTimeout(() => {
      setMenuState({
        anchorEl: null,
        user: null,
      });
    }, 200);
  }, []);

  const handleActivateUser = useCallback(async () => {
    const currentUser = menuState.user;
    if (!currentUser) return;

    handleMenuClose();

    try {
      await UsersAPI.updateUserRole(currentUser.id, ROLES.COLAB);
      await loadUsers();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }, [menuState.user, loadUsers, handleMenuClose]);

  const handleDeactivateUser = useCallback(async () => {
    const currentUser = menuState.user;
    if (!currentUser) return;

    handleMenuClose();

    try {
      await UsersAPI.updateUserRole(currentUser.id, ROLES.PENDING_APPROVAL);
      await loadUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  }, [menuState.user, loadUsers, handleMenuClose]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  }, []);

  const handleRequestSort = useCallback((property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [orderBy, order]);

  const getRoleChipColor = (role: number) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'error';
      case ROLES.COLAB:
        return 'success';
      case ROLES.PENDING_APPROVAL:
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Loading indicator */}
      <Box sx={{ width: '100%', height: 4, mb: 2 }}>
        {loading ? <LinearProgress /> : <Box sx={{ height: 4 }} />}
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          opacity: loading ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'transparent' }}>
              <TableCell sx={{ fontWeight: 600, width: '25%' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '35%' }}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Correo
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '30%' }}>
                <TableSortLabel
                  active={orderBy === 'role'}
                  direction={orderBy === 'role' ? order : 'asc'}
                  onClick={() => handleRequestSort('role')}
                >
                  Rol
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: '10%' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No hay usuarios disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={ROLE_LABELS[user.role]}
                      color={getRoleChipColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {user.id !== currentUser?.id && (
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, user)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>

      <Menu
        anchorEl={menuState.anchorEl}
        open={Boolean(menuState.anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 0.5,
            },
          },
        }}
      >
        {menuState.user?.role === ROLES.PENDING_APPROVAL && (
          <MenuItem onClick={handleActivateUser}>Activar cuenta</MenuItem>
        )}
        {menuState.user?.role === ROLES.COLAB && (
          <MenuItem onClick={handleDeactivateUser}>Desactivar cuenta</MenuItem>
        )}
      </Menu>
    </Box>
  );
};
