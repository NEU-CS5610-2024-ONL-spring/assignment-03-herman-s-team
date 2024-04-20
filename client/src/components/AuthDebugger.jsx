import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { Card, CardContent, Typography } from '@mui/material';

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();


  return (
    <div>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6">Access Token:</Typography>
          <pre style={{ maxHeight: '200px', overflow: 'auto', backgroundColor: '#f5f5f5', padding: '8px' }}>
            {JSON.stringify(accessToken, null, 2)}
          </pre>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">User Info</Typography>
          <pre style={{ maxHeight: '200px', overflow: 'auto', backgroundColor: '#f5f5f5', padding: '8px' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}