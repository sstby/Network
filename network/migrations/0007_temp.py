# Generated by Django 3.2.8 on 2021-12-11 10:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_post_images'),
    ]

    operations = [
        migrations.CreateModel(
            name='Temp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kek', models.CharField(max_length=65)),
            ],
        ),
    ]