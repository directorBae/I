type ContactInfoProps = {
  email: string;
  phone: string;
};

export const ContactInfo = ({ email, phone }: ContactInfoProps) => {
  return (
    <div>
      <div className="text-xs md:text-sm lg:text-base font-regular text-[#242424] whitespace-pre-wrap">
        {phone}
      </div>
      <div className="text-xs md:text-sm lg:text-base font-regular text-[#242424] whitespace-pre-wrap">
        {email}
      </div>
    </div>
  );
};
