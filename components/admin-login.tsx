import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function AdminLogin({ invalid }: { invalid: boolean }) {
  return <main className="admin-login"><section className="admin-login-card"><Link href="/" className="admin-back"><ArrowLeft size={16}/> Volver a la tienda</Link><div className="admin-login-mark"><LockKeyhole size={22}/></div><p className="admin-eyebrow">EL DIVÁN · ACCESO PRIVADO</p><h1 className="editorial-serif">Administración</h1><p className="admin-muted">Ingresa con las credenciales del administrador.</p>{invalid && <p className="admin-error" role="alert">Usuario o contraseña incorrectos.</p>}<form action="/api/admin/login" method="post" className="admin-login-form"><label>Usuario<input name="username" autoComplete="username" required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label><button className="admin-primary">Ingresar al panel <span>→</span></button></form><p className="admin-login-note">El acceso está protegido y la sesión se cierra automáticamente después de 8 horas.</p></section></main>;
}
