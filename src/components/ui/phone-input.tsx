import * as React from "react";
import { ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { COUNTRIES, CountryData, formatPhoneNumber } from "@/lib/countries";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, placeholder = "Enter phone number", className, id, disabled, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState<CountryData>(
      COUNTRIES[0] // Default to Zimbabwe
    );
    const [phoneNumber, setPhoneNumber] = React.useState("");

    // Initialize from value prop
    React.useEffect(() => {
      if (value) {
        // Try to detect country from phone number
        const detectedCountry = COUNTRIES.find(country => 
          value.startsWith(country.phoneCode)
        );
        
        if (detectedCountry) {
          setSelectedCountry(detectedCountry);
          setPhoneNumber(value.replace(detectedCountry.phoneCode, '').trim());
        } else {
          setPhoneNumber(value);
        }
      }
    }, [value]);

    const handleCountrySelect = (country: CountryData) => {
      setSelectedCountry(country);
      setOpen(false);
      
      // Update the full phone number
      const fullNumber = phoneNumber 
        ? `${country.phoneCode} ${phoneNumber}`
        : country.phoneCode;
      onChange?.(fullNumber);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumber = e.target.value;
      setPhoneNumber(newPhoneNumber);
      
      // Combine country code with phone number
      const fullNumber = newPhoneNumber 
        ? `${selectedCountry.phoneCode} ${newPhoneNumber}`
        : selectedCountry.phoneCode;
      onChange?.(fullNumber);
    };

    return (
      <div className={cn("flex w-full", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[140px] justify-between rounded-r-none border-r-0 bg-muted/50"
              disabled={disabled}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-sm font-medium">{selectedCountry.phoneCode}</span>
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 bg-background border shadow-lg" align="start">
            <Command>
              <CommandInput placeholder="Search country..." className="h-9" />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {COUNTRIES.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.phoneCode}`}
                      onSelect={() => handleCountrySelect(country)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="flex-1">{country.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {country.phoneCode}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <div className="relative flex-1">
          <Input
            ref={ref}
            id={id}
            type="tel"
            placeholder={placeholder}
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={cn(
              "rounded-l-none pl-10",
              className
            )}
            disabled={disabled}
            {...props}
          />
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };