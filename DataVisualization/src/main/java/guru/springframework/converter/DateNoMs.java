package guru.springframework.converter;

import java.util.Date;

/**
 * Oracle stores dates in DATE columns down to the second; Java stores them to the millisecond.
 * This occasionally can confuse Hibernate as to what data are stale.  This class slices off
 * any milliseconds which might be present in its representation.
 */
public class DateNoMs extends java.util.Date {
    private static final long serialVersionUID = 1L;


    /**
     * @see java.util.Date()
     */
    public DateNoMs() {
        super();
        long t = getTime();
        setTime(t - t % 1000);
    }


    /**
     * @see java.util.Date(long)
     */
    public DateNoMs(long time) {
        super(time - time % 1000);
    }

    /**
     * @param value
     */
    public DateNoMs(Date value) {
        long t = value.getTime();
        setTime(t - t % 1000);
    }


    /**
     * @see java.util.Date#setTime(long)
     */
    @Override
    public void setTime(long time) {
        super.setTime(time - time % 1000);
    }
}
