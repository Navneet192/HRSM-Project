from rest_framework import serializers
from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department']

    def validate_employee_id(self, value):
        qs = Employee.objects.filter(employee_id=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("An employee with this Employee ID already exists.")
        return value

    def validate_email(self, value):
        qs = Employee.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("An employee with this email address already exists.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'status']

    def validate_status(self, value):
        allowed = Attendance.Status.values
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid status '{value}'. Allowed values are: {allowed}."
            )
        return value

    def validate(self, attrs):
        employee = attrs.get('employee')
        date = attrs.get('date')
        qs = Attendance.objects.filter(employee=employee, date=date)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "An attendance record for this employee on this date already exists."
            )
        return attrs
