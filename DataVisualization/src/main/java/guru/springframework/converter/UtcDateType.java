package guru.springframework.converter;

import org.hibernate.type.DateType;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.TimeZone;

public class UtcDateType extends DateType {

    private static final TimeZone UTC = TimeZone.getTimeZone("UTC");

    @Override
    public Object get(ResultSet rs, String name) throws SQLException {
        return rs.getDate(name, Calendar.getInstance(UTC));
    }

    @Override
    public void set(PreparedStatement st, Object value, int index) throws SQLException{

    }
}
