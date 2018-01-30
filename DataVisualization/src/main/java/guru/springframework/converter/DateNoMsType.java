package guru.springframework.converter;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

/**
 * Map "things" (currently Oracle Date columns) to the DateNoMs.
 */
public class DateNoMsType implements UserType {

    /**
     * @see org.hibernate.usertype.UserType#assemble(java.io.Serializable, Object)
     */
    public Object assemble(Serializable cached, @SuppressWarnings("unused") Object owner) {
        return cached;
    }

    /**
     * @see org.hibernate.usertype.UserType#deepCopy(Object)
     */
    public Object deepCopy(Object value) {
        if (value == null)
            return null;

        if (!(value instanceof java.util.Date))
            throw new UnsupportedOperationException("can't convert " + value.getClass());
        return new DateNoMs((java.util.Date) value);
    }

    /**
     * @see org.hibernate.usertype.UserType#disassemble(Object)
     */
    public Serializable disassemble(Object value) throws HibernateException {
        if (!(value instanceof java.util.Date))
            throw new UnsupportedOperationException("can't convert " + value.getClass());

        return new DateNoMs((java.util.Date) value);
    }

    /**
     * @see org.hibernate.usertype.UserType#equals(Object, Object)
     */
    public boolean equals(Object x, Object y) throws HibernateException {
        return x.equals(y);
    }

    /**
     * @see org.hibernate.usertype.UserType#hashCode(Object)
     */
    public int hashCode(Object value) throws HibernateException {
        return value.hashCode();
    }

    /**
     * @see org.hibernate.usertype.UserType#isMutable()
     */
    public boolean isMutable() {
        return true;
    }

    /**
     * @see org.hibernate.usertype.UserType#nullSafeGet(java.sql.ResultSet, String[], SharedSessionContractImplementor, Object)
     */
    public Object nullSafeGet(ResultSet rs, String[] names, SharedSessionContractImplementor var3, @SuppressWarnings("unused") Object owner)
            throws HibernateException, SQLException {
        // assume that we only map to one column, so there's only one column name
        java.sql.Date value = rs.getDate(names[0]);
        if (value == null)
            return null;

        return new DateNoMs(value.getTime());
    }

    /**
     * @see org.hibernate.usertype.UserType#nullSafeSet(java.sql.PreparedStatement, Object, int, SharedSessionContractImplementor)
     */
    public void nullSafeSet(PreparedStatement stmt, Object value, int index, SharedSessionContractImplementor var4)
            throws HibernateException, SQLException {
        if (value == null) {
            stmt.setNull(index, Types.DATE);
            return;
        }

        if (!(value instanceof java.util.Date))
            throw new UnsupportedOperationException("can't convert " + value.getClass());

        stmt.setDate(index, new java.sql.Date(((java.util.Date) value).getTime()));
    }

    /**
     * @see org.hibernate.usertype.UserType#replace(Object, Object, Object)
     */
    public Object replace(Object original,
                          @SuppressWarnings("unused") Object target, @SuppressWarnings("unused") Object owner) {
        return original;
    }

    /**
     * @see org.hibernate.usertype.UserType#returnedClass()
     */
    @SuppressWarnings("unchecked")
    public Class returnedClass() {
        return DateNoMs.class;
    }

    /**
     * @see org.hibernate.usertype.UserType#sqlTypes()
     */
    public int[] sqlTypes() {
        return new int[]{Types.DATE};
    }

}