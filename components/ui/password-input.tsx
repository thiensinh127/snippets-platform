import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  showPasswordToggle?: boolean
  strengthIndicator?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showPasswordToggle = true, strengthIndicator = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [password, setPassword] = React.useState('')

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const getPasswordStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      return strength
    }

    const strength = getPasswordStrength(password)
    const strengthColors = {
      0: 'bg-gray-200',
      1: 'bg-red-500',
      2: 'bg-orange-500', 
      3: 'bg-yellow-500',
      4: 'bg-blue-500',
      5: 'bg-green-500'
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              className
            )}
            ref={ref}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              props.onChange?.(e)
            }}
            {...props}
          />
          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              disabled={props.disabled}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          )}
        </div>
        
        {strengthIndicator && password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i < strength ? strengthColors[strength as keyof typeof strengthColors] : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {strength === 0 && "Enter a password"}
              {strength === 1 && "Very weak"}
              {strength === 2 && "Weak"}
              {strength === 3 && "Fair"}
              {strength === 4 && "Good"}
              {strength === 5 && "Strong"}
            </p>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
