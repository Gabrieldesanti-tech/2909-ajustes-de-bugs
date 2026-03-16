"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PhizLogin from "@/components/auth/PhizLogin";
import { formatCPF, formatPhone, validateCPF, validateEmail } from "@/lib/utils";

type AuthMode = "login" | "register";
type LoginMethod = "cpf" | "phiz";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("cpf");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [loginData, setLoginData] = useState({ cpf: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleCPFChange = (value: string, isLogin: boolean) => {
    const formatted = formatCPF(value.replace(/\D/g, "").slice(0, 11));
    if (isLogin) {
      setLoginData({ ...loginData, cpf: formatted });
    } else {
      setRegisterData({ ...registerData, cpf: formatted });
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value.replace(/\D/g, "").slice(0, 11));
    setRegisterData({ ...registerData, phone: formatted });
  };

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginData.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(loginData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    
    if (!loginData.password) {
      newErrors.password = "Senha é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!registerData.name || registerData.name.length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }
    
    if (!registerData.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(registerData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    
    if (!registerData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!registerData.phone) {
      newErrors.phone = "Telefone é obrigatório";
    }
    
    if (!registerData.password || registerData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    try {
      // Simulação de login - em produção, chamar API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: loginData.cpf.replace(/\D/g, ""),
          password: loginData.password,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect");
        const userRole = data.data?.user?.role;
        const isStaff = ["ADMIN", "MANAGER", "ANALYST", "ATTENDANT"].includes(userRole);
        const redirectTo = redirectParam || (isStaff ? "/admin" : "/");
        window.location.href = redirectTo;
      } else {
        const data = await response.json();
        setErrors({ form: data.error || "Erro ao fazer login" });
      }
    } catch {
      setErrors({ form: "Erro de conexão. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          cpf: registerData.cpf.replace(/\D/g, ""),
          email: registerData.email,
          phone: registerData.phone.replace(/\D/g, ""),
          password: registerData.password,
        }),
      });
      
      if (response.ok) {
        // Redirecionar para login ou área logada
        setMode("login");
        setErrors({ form: "Cadastro realizado com sucesso! Faça login." });
      } else {
        const data = await response.json();
        setErrors({ form: data.error || "Erro ao cadastrar" });
      }
    } catch {
      setErrors({ form: "Erro de conexão. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-soft border border-neutral-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => {
                setMode("login");
                setLoginMethod("cpf");
                setErrors({});
              }}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                mode === "login"
                  ? "bg-primary text-white"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setMode("register");
                setErrors({});
              }}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                mode === "register"
                  ? "bg-primary text-white"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="p-6">
            {/* Erro geral */}
            {errors.form && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  errors.form.includes("sucesso")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {errors.form}
              </div>
            )}

            {mode === "login" ? (
              /* Login: CPF ou Phiz */
              <div className="space-y-4">
                {loginMethod === "cpf" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                      label="CPF"
                      name="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={loginData.cpf}
                      onChange={(e) => handleCPFChange(e.target.value, true)}
                      error={errors.cpf}
                      leftIcon={<User size={18} />}
                      required
                    />

                    <div className="relative">
                      <Input
                        label="Senha"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        error={errors.password}
                        leftIcon={<Lock size={18} />}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <div className="text-right">
                      <Link
                        href="/auth/recuperar-senha"
                        className="text-sm text-primary hover:underline"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      isLoading={isLoading}
                      rightIcon={<ArrowRight size={18} />}
                    >
                      Entrar
                    </Button>
                  </form>
                ) : (
                  <PhizLogin />
                )}

                {loginMethod === "cpf" ? (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-neutral-500">ou</span>
                    </div>
                  </div>
                ) : null}
                {loginMethod === "cpf" ? (
                  <button
                    type="button"
                    onClick={() => setLoginMethod("phiz")}
                    className="w-full text-sm text-neutral-600 hover:text-primary"
                  >
                    Entrar com Phiz (QR Code)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLoginMethod("cpf")}
                    className="w-full text-sm text-neutral-600 hover:text-primary"
                  >
                    Voltar para login com CPF
                  </button>
                )}
              </div>
            ) : (
              /* Formulário de Cadastro */
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Nome completo"
                  name="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  error={errors.name}
                  leftIcon={<User size={18} />}
                  required
                />

                <Input
                  label="CPF"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={registerData.cpf}
                  onChange={(e) => handleCPFChange(e.target.value, false)}
                  error={errors.cpf}
                  leftIcon={<User size={18} />}
                  required
                />

                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  error={errors.email}
                  leftIcon={<Mail size={18} />}
                  required
                />

                <Input
                  label="Telefone"
                  name="phone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={registerData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  error={errors.phone}
                  leftIcon={<Phone size={18} />}
                  required
                />

                <div className="relative">
                  <Input
                    label="Senha"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    error={errors.password}
                    leftIcon={<Lock size={18} />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Input
                  label="Confirmar senha"
                  name="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  error={errors.confirmPassword}
                  leftIcon={<Lock size={18} />}
                  required
                />

                <p className="text-xs text-neutral-500">
                  Ao se cadastrar, você concorda com nossos{" "}
                  <Link href="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                  .
                </p>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Cadastrar
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Link para voltar */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-600 hover:text-primary">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
