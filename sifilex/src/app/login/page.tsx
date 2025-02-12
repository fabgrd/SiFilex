// // pages/index.tsx
// 'use client';

// import { useUser } from '@auth0/nextjs-auth0';
// import { Button } from 'antd';

// export default function HomePage() {
//   const { user, error, isLoading } = useUser();

//   if (isLoading) return <div>Chargement...</div>;

//   if (user) {
//     return (
//       <div>
//         <h1>Bienvenue, {user.name}</h1>
//         <Button onClick={() => window.location.href = '/api/auth/logout'}>Se déconnecter</Button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Bienvenue sur mon portfolio</h1>
//       <Button onClick={() => window.location.href = '/api/auth/login'}>Se connecter avec Auth0</Button>
//     </div>
//   );
// }
