import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Typography,
} from "@mui/material";

interface CardInfoProps extends React.ComponentProps<typeof Card> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  avatar?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const CardInfo: React.FC<CardInfoProps> = ({
  title,
  subtitle,
  children,
  actions,
  avatar,
  headerAction,
  sx,
  elevation = 2,
  ...cardProps
}) => (
  <Card
    elevation={elevation}
    sx={{
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover": { boxShadow: 4 },
      ...sx,
    }}
    {...cardProps}
  >
    {(title || avatar || headerAction) && (
      <CardHeader
        avatar={avatar}
        action={headerAction}
        title={
          title ? (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          ) : undefined
        }
        subheader={
          subtitle ? (
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              {subtitle}
            </Typography>
          ) : undefined
        }
      />
    )}

    <CardContent>
      <Box>{children}</Box>
    </CardContent>

    {actions && (
      <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
        {actions}
      </CardActions>
    )}
  </Card>
);
