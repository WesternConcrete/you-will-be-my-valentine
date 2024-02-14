import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import { clsx, type ClassValue } from 'clsx'
import { DateValue } from 'react-aria'
import { twMerge } from 'tailwind-merge'

export const LETTERS_LOWER = 'abcdefghijklmnopqrstuvwxyz'
export const LETTERS_UPPER = LETTERS_LOWER.toUpperCase()
export const NUMBERS = Array.from(Array(1000).keys()).join('')

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    })
}

export const formatDateToLocal = (
    d: Date | string,
    opts?: {
        locale?: string
        includeTime?: boolean
    }
) => {
    const date = typeof d === 'string' ? new Date(d) : d
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }

    const includeTime = opts?.includeTime ?? false
    if (includeTime) {
        options.hour = 'numeric'
        options.minute = 'numeric'
        options.timeZoneName = 'short'
    }

    const locale = opts?.locale || 'en-US'

    const formatter = new Intl.DateTimeFormat(locale, options)
    return formatter.format(date)
}

export const isNullOrUndefined = <T>(
    value: T | null | undefined
): value is null | undefined => {
    return value === null || value === undefined
}

export const isNumber = <T>(value: T | unknown): value is Number => {
    return typeof value === 'number'
}

export const isBoolean = <T>(value: T | unknown): value is Boolean => {
    return typeof value === 'boolean'
}

export const isDate = <T>(value: T | unknown): value is Date => {
    return value instanceof Date
}

export const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

export const camelCaseToTitleCase = (str: string) => {
    // take a camel case string like generateImageUrl and return Generate Image Url
    const words = str.split(/(?=[A-Z])/)
    return words.map((word) => toTitleCase(word)).join(' ')
}

export const truncate = (str: string, n: number) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str
}

export const startsWithVowel = (str: string) => {
    return /^[aeiou]/i.test(str)
}

/**
 * return a value that has been rounded to a set precision
 */
export const round = (value: number, precision = 3) =>
    parseFloat(value.toFixed(precision))

/**
 * return a value that has been limited between min & max
 */
export const clamp = (value: number, min = 0, max = 100) => {
    return Math.min(Math.max(value, min), max)
}

/**
 * return a value that has been re-mapped according to the from/to
 * - for example, adjust(10, 0, 100, 100, 0) = 90
 */
export const adjust = (
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
) => {
    return round(
        toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin)
    )
}

export function isValidUrl(url: string) {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

export function getUrlFromString(str: string) {
    if (isValidUrl(str)) return str
    try {
        if (str.includes('.') && !str.includes(' ')) {
            return new URL(`https://${str}`).toString()
        }
    } catch (e) {
        return null
    }
}

export const isEmptyString = (str: string) => {
    if (str === '""') return true
    return str.trim().length === 0
}

function getRandomJitter(jitterValue: number): number {
    return Math.random() * (jitterValue * 2) - jitterValue
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchRequestWithRetries<T>(
    req: () => Promise<T>,
    errMessage: string = 'Max retries reached.',
    MAX_RETRIES = 5,
    BASE_DELAY_MS = 500,
    JITTER_MS = 100
): Promise<T> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await req()
        } catch (error) {
            let backoffTime =
                BASE_DELAY_MS * Math.pow(2, attempt) + getRandomJitter(JITTER_MS)
            console.warn(`Rate limited! Retrying in ${backoffTime}ms...`)
            await delay(backoffTime)
        }
    }

    // If it reaches here, it means all retry attempts failed.
    throw new Error(errMessage)
}

/**
 * Check if a value is empty
 * This is a more robust version of lodash's isEmpty
 */
export const isEmpty = (v: unknown): v is null | undefined | '' => {
    if (v === undefined || v === null) return true
    if (typeof v === 'string') return v.trim().length === 0
    if (typeof v === 'object') return Object.keys(v).length === 0
    if (Array.isArray(v)) return v.length === 0
    return false
}

/**
 *
 * @returns true if the current environment is production
 */
export const isProduction = () => {
    return (
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.VERCEL_ENV === 'production' ||
        process.env.SEED_ENV === 'prod'
    )
}

export const getBaseURL = () => {
    if (typeof window !== 'undefined')
        // browser should use relative path
        return window.location.origin
    if (process.env.DEPLOYED_BASE_URL)
        return `https://${process.env.DEPLOYED_BASE_URL}`
    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`
}

export function isObject(value: unknown): value is Record<string, unknown> {
    // check that value is object
    return !!value && !Array.isArray(value) && typeof value === 'object'
}

export const getIntFromString = (str?: string | null): number | null => {
    if (isNullOrUndefined(str)) return null
    const num = Number(str)
    return isNaN(num) ? null : round(num)
}

export const getDateValueFromString = (str: string): DateValue | null => {
    const date = new Date(str)

    // if the date is invalid, return null
    if (isNaN(date.getTime())) return null

    // check if there is a time component
    if (str.includes(':')) {
        return new CalendarDateTime(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )
    }

    return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    )
}

export const getLocalISODateTime = () => {
    const date = new Date()
    const offset = date.getTimezoneOffset() * 60000 // Convert offset to milliseconds
    const localISOTime = new Date(date.getTime() - offset).toISOString()

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]
    const dayOfWeek = days[date.getDay()]

    return `${dayOfWeek}, ${localISOTime.slice(0, -1)}`
}

export const getRelativeDateString = (date: Date) => {
    // return things like 2 hours ago, 3 days ago, 1 month ago, etc.
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return `${seconds} second${seconds > 1 ? 's' : ''} ago`
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (hours < 48) return 'yesterday'

    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`

    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`

    const years = Math.floor(months / 12)
    return `${years} year${years > 1 ? 's' : ''} ago`
}

export const generateColourFromString = (str: string) => {
    const hash = str.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0)

    const hue = hash % 360
    const saturation = 100
    const lightness = 50

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function base64ToFile(base64: string, filename: string): File {
    const byteString = atob(base64)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: 'image/png' })
    return new File([blob], filename, { type: 'image/png' })
}

export function disableMouseEvents() {
    if (document.querySelector('.mouse-disabled-overlay')) return
    let overlay = document.createElement('div')
    overlay.classList.add('mouse-disabled-overlay')
    overlay.addEventListener('mousedown', (e) => {
        e.preventDefault()
    })
    document.body.appendChild(overlay)
}

export function enableMouseEvents() {
    let overlay = document.querySelector('.mouse-disabled-overlay')
    if (overlay) {
        overlay.remove()
    }
}

export const prettifyNumber = (num: number) => {
    return num.toLocaleString('en-US')
}
