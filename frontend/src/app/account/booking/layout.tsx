import styles from './booking.module.css';
import BookingMenu from "@/components/BookingMenu";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div>
      

      {children}
    </div>
  );
}
