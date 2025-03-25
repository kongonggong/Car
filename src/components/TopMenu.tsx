import styles from './topmenu.module.css';
import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Link from 'next/link'; // Correcting Link import for Next.js

export default async function TopMenu() {
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.menucontainer}>
            <Link href='/'>
                <Image 
                    src='/img/logo.png'
                    className={styles.logoimg}
                    alt='logo'
                    width={0}
                    height={0}
                    sizes='100vh'
                />
            </Link>

            <TopMenuItem title='Booking' pageRef='/booking' />

           

            <TopMenuItem title='My Booking' pageRef='/mybooking' />
            <TopMenuItem title='Provider' pageRef='/provider' />
            {session?.user?.role === 'admin' && (
                <TopMenuItem title='All Booking' pageRef='/allbooking' />
            )}
            {session ? (
                <Link href="/api/auth/signout">
                    <div className='flex items-center absolute right-0 h-full px-2 text-cyan-600 text-sm'>
                        Sign-Out of {session.user?.name}
                        {session.user?.role === 'admin' && (
                            <span className="ml-1 text-gold font-semibold">(Admin)</span>
                        )}
                    </div>
                </Link>
            ) : (
                <div className="absolute right-0 flex items-center h-full px-2 space-x-4 text-sm">
                    <Link href="/api/auth/signin" className="text-cyan-600">Sign-In</Link>
                    <Link href="/register" className="text-green-500 font-semibold">Register</Link>
                </div>
            )}
        </div>
    );
}
