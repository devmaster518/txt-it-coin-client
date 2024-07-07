import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

// import { useRouter } from 'src/routes/hooks';

import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { User } from 'src/__generated__/graphql';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: User;
  onSelectRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,

  onSelectRow,
}: Props) {
  const { username, email, isAdmin, createdAt, updatedAt, deletedAt } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={username}
          secondary={email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {isAdmin ? (
          <Label variant="soft" color="primary">
            Admin
          </Label>
        ) : (
          <Label variant="soft" color="secondary">
            User
          </Label>
        )}
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(createdAt)}
          secondary={fTime(createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={fDate(updatedAt)}
          secondary={fTime(updatedAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        {deletedAt ? (
          <Tooltip title={`Disabled at ${fDateTime(deletedAt)}`} placement="top" arrow>
            <Label variant="soft" color="error">
              Disabled
            </Label>
          </Tooltip>
        ) : (
          <Label variant="soft" color="success">
            Active
          </Label>
        )}
      </TableCell>
    </TableRow>
  );
}
